const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const fsp = require('fs/promises')

module.exports = function createInstructorRouter({ pool, dataRoot }) {
  const router = express.Router()
  const LMS_ACCOUNT = '9999999999999999'
  const COURSE_UPLOAD_REWARD = 10

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isVideo = /\[video\]$/.test(file.fieldname)
      const uploadDir = path.join(dataRoot, isVideo ? 'videos' : 'materials')
      fs.mkdirSync(uploadDir, { recursive: true })
      cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      cb(null, uniqueSuffix + path.extname(file.originalname || ''))
    },
  })

  const upload = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 } })

  const ensureCourseManifest = async (coursePayload) => {
    const coursesDir = path.join(dataRoot, 'courses')
    const manifestPath = path.join(coursesDir, 'index.json')
    const courseFilePath = path.join(coursesDir, `${coursePayload.courseId}.json`)

    await fsp.mkdir(coursesDir, { recursive: true })
    await fsp.writeFile(courseFilePath, JSON.stringify(coursePayload, null, 2))

    let manifest = []
    if (fs.existsSync(manifestPath)) {
      try {
        manifest = JSON.parse(await fsp.readFile(manifestPath, 'utf-8'))
      } catch {
        manifest = []
      }
    }

    const existingIndex = manifest.findIndex((entry) => entry.courseId === coursePayload.courseId)
    if (existingIndex > -1) {
      manifest[existingIndex] = coursePayload
    } else {
      manifest.push(coursePayload)
    }

    await fsp.writeFile(manifestPath, JSON.stringify(manifest, null, 2))
  }

  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username and password are required',
        })
      }

      const connection = await pool.getConnection()
      const [rows] = await connection.execute('SELECT * FROM instructor WHERE username = ?', [username])
      connection.release()

      if (rows.length === 0 || rows[0].password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password',
        })
      }

      const instructor = rows[0]

      res.json({
        success: true,
        message: 'Login successful',
        instructor: {
          id: instructor.tid,
          username: instructor.username,
          isSet: instructor.payment_setup,
          bank_acc_no: instructor.bank_acc_no,
          bank_secret_key: instructor.bank_secret_key,
        },
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({
        success: false,
        message: 'Server error',
      })
    }
  })

  router.post('/instructor/payment-setup', async (req, res) => {
    try {
      const { username, bankAccNo, bankSecretKey } = req.body

      if (!username || !bankAccNo || !bankSecretKey) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required',
        })
      }

      const connection = await pool.getConnection()
      await connection.execute(
        'UPDATE instructor SET payment_setup = 1, bank_acc_no = ?, bank_secret_key = ? WHERE username = ?',
        [bankAccNo, bankSecretKey, username]
      )

      const [rows] = await connection.execute('SELECT * FROM instructor WHERE username = ?', [username])
      const instructor = rows[0]
      connection.release()

      res.json({
        success: true,
        message: 'Payment setup saved successfully',
        instructor: {
          username: instructor.username,
          payment_setup: instructor.payment_setup,
          bank_acc_no: instructor.bank_acc_no,
          bank_secret_key: instructor.bank_secret_key,
        },
      })
    } catch (error) {
      console.error('Payment setup error:', error)
      res.status(500).json({
        success: false,
        message: 'Server error',
      })
    }
  })

  router.post('/courses/upload', upload.any(), async (req, res) => {
    let connection
    try {
      const { instructorId, title, description, numberOfLectures, price } = req.body

      if (!instructorId || !title || !description || !numberOfLectures || price === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Missing required course information',
        })
      }

      const instructorIdNum = Number(instructorId)
      if (Number.isNaN(instructorIdNum) || instructorIdNum <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Instructor ID must be a positive number',
        })
      }

      const lectureCount = parseInt(numberOfLectures, 10)
      if (Number.isNaN(lectureCount) || lectureCount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Number of lectures must be a positive integer',
        })
      }

      const parsedPrice = Number(price)
      if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a non-negative number',
        })
      }

      const files = req.files || []
      connection = await pool.getConnection()
      await connection.beginTransaction()

      try {
        const [courseResult] = await connection.execute(
          'INSERT INTO course (course_name, description, price, instructor_id) VALUES (?, ?, ?, ?)',
          [title, description, parsedPrice, instructorIdNum]
        )

        const courseId = courseResult.insertId

        const getLectureTitle = (index) => {
          const possibleKeys = [
            `lectures[${index}][title]`,
            `lectures.${index}.title`,
            `lectures[${index}]title`,
          ]

          for (const key of possibleKeys) {
            if (req.body[key] !== undefined) {
              return req.body[key]
            }
          }

          if (req.body.lectures && Array.isArray(req.body.lectures) && req.body.lectures[index]) {
            return req.body.lectures[index].title
          }

          return null
        }

        const lectureFiles = {}
        files.forEach((file) => {
          const match = file.fieldname.match(/^lectures\[(\d+)\]\[(video|materials)\]/)
          if (!match) {
            return
          }

          const lectureIndex = Number(match[1])
          if (Number.isNaN(lectureIndex)) {
            return
          }

          if (!lectureFiles[lectureIndex]) {
            lectureFiles[lectureIndex] = { video: null, materials: [] }
          }

          if (match[2] === 'video' && !lectureFiles[lectureIndex].video) {
            lectureFiles[lectureIndex].video = file
          } else if (match[2] === 'materials') {
            lectureFiles[lectureIndex].materials.push(file)
          }
        })

        const lecturesPayload = []

        for (let i = 0; i < lectureCount; i++) {
          const lectureTitle = getLectureTitle(i)
          const videoFile = lectureFiles[i]?.video
          const materialFiles = lectureFiles[i]?.materials ?? []

          if (!lectureTitle) {
            throw new Error(`Lecture ${i + 1} is missing a title.`)
          }

          if (!videoFile) {
            throw new Error(`Lecture ${i + 1} is missing a video.`)
          }

          const videoPath = `/uploads/videos/${videoFile.filename}`

          const [lectureResult] = await connection.execute(
            'INSERT INTO course_lecture (course_id, lecture_number, title, video_path, video_original_name, video_mime, video_size, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
            [courseId, i + 1, lectureTitle, videoPath, videoFile.originalname, videoFile.mimetype, videoFile.size]
          )

          const lectureId = lectureResult.insertId

          const materialsPayload = []
          for (const file of materialFiles) {
            const materialPath = `/uploads/materials/${file.filename}`
            await connection.execute(
              'INSERT INTO course_material (lecture_id, material_type, file_path, file_name, created_at) VALUES (?, ?, ?, ?, NOW())',
              [lectureId, file.mimetype, materialPath, file.originalname]
            )
            materialsPayload.push({
              originalName: file.originalname,
              mimeType: file.mimetype,
              storagePath: materialPath,
              filename: file.filename,
            })
          }

          const quizzesPayload = []
          const quizPattern = new RegExp(`^quiz_${i}_(\\d+)_(question|optionA|optionB|optionC|optionD|correctAnswer)$`)
          const quizData = {}

          Object.keys(req.body).forEach((key) => {
            const match = key.match(quizPattern)
            if (match) {
              const quizIdx = parseInt(match[1], 10)
              const field = match[2]
              if (!quizData[quizIdx]) {
                quizData[quizIdx] = {}
              }
              quizData[quizIdx][field] = req.body[key]
            }
          })

          const quizIndices = Object.keys(quizData).map(Number).sort((a, b) => a - b)
          for (const quizIndex of quizIndices) {
            const quiz = quizData[quizIndex]
            const { question, optionA, optionB, optionC, optionD, correctAnswer } = quiz

            if (question && optionA && optionB && optionC && optionD && correctAnswer) {
              await connection.execute(
                'INSERT INTO lecture_quiz (lecture_id, question, option_a, option_b, option_c, option_d, correct_answer, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
                [lectureId, question, optionA, optionB, optionC, optionD, correctAnswer]
              )

              quizzesPayload.push({ question, optionA, optionB, optionC, optionD, correctAnswer })
            }
          }

          lecturesPayload.push({
            lectureNumber: i + 1,
            title: lectureTitle,
            video: {
              originalName: videoFile.originalname,
              mimeType: videoFile.mimetype,
              storagePath: videoPath,
              filename: videoFile.filename,
              size: videoFile.size,
            },
            materials: materialsPayload,
            quizzes: quizzesPayload,
          })
        }

        const coursePayload = {
          courseId,
          instructorId: instructorIdNum,
          title,
          description,
          price: parsedPrice,
          numberOfLectures: lectureCount,
          lectures: lecturesPayload,
          createdAt: new Date().toISOString(),
        }

        await ensureCourseManifest(coursePayload)
        await connection.commit()

        let rewardSent = false
        let rewardMessage = 'Reward not processed'

        try {
          const [instructorRows] = await connection.execute(
            'SELECT bank_acc_no, payment_setup FROM instructor WHERE tid = ?',
            [instructorIdNum]
          )

          if (instructorRows.length > 0 && instructorRows[0].payment_setup && instructorRows[0].bank_acc_no) {
            const rewardTransferResponse = await fetch('http://localhost:3000/bank-api/transfer-lms-to-instructor', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to_account_no: instructorRows[0].bank_acc_no,
                amount: COURSE_UPLOAD_REWARD,
              }),
            })

            const rewardTransferData = await rewardTransferResponse.json()
            if (rewardTransferData.success) {
              rewardSent = true
              rewardMessage = `Instructor reward of $${COURSE_UPLOAD_REWARD} sent successfully`
            } else {
              rewardMessage = rewardTransferData.error || 'Reward was skipped'
            }
          } else {
            rewardMessage = 'Reward skipped because instructor payment setup is incomplete'
          }
        } catch (rewardError) {
          console.error('Course upload reward transfer error:', rewardError)
          rewardMessage = 'Reward skipped due to transfer service error'
        }

        res.json({
          success: true,
          message: 'Course uploaded successfully',
          courseId,
          rewardSent,
          rewardMessage,
        })
      } catch (innerError) {
        if (connection) {
          await connection.rollback()
        }
        throw innerError
      }
    } catch (error) {
      console.error('Course upload error:', error)
      res.status(500).json({
        success: false,
        message: `Server error: ${error.message}`,
      })
    } finally {
      if (connection) {
        connection.release()
      }
    }
  })

  router.get('/courses/instructor/:instructorId', async (req, res) => {
    try {
      const { instructorId } = req.params

      if (!instructorId) {
        return res.status(400).json({
          success: false,
          message: 'Instructor ID is required',
        })
      }

      const connection = await pool.getConnection()
      const [courses] = await connection.execute(
        'SELECT cid AS id, course_name AS title, description, price FROM course WHERE instructor_id = ? ORDER BY cid DESC',
        [instructorId]
      )

      for (const course of courses) {
        const [lectures] = await connection.execute(
          'SELECT * FROM course_lecture WHERE course_id = ? ORDER BY lecture_number ASC',
          [course.id]
        )

        for (const lecture of lectures) {
          const [materials] = await connection.execute(
            'SELECT * FROM course_material WHERE lecture_id = ? ORDER BY created_at ASC',
            [lecture.id]
          )
          lecture.materials = materials

          const [quizzes] = await connection.execute(
            'SELECT * FROM lecture_quiz WHERE lecture_id = ? ORDER BY created_at ASC',
            [lecture.id]
          )
          lecture.quizzes = quizzes
        }

        course.lectures = lectures
      }

      connection.release()

      res.json({
        success: true,
        courses,
      })
    } catch (error) {
      console.error('Get courses error:', error)
      res.status(500).json({
        success: false,
        message: 'Server error',
      })
    }
  })

  router.get('/instructor/:instructorId/transactions', async (req, res) => {
    let connection
    try {
      const { instructorId } = req.params

      if (!instructorId) {
        return res.status(400).json({
          success: false,
          message: 'Instructor ID is required',
        })
      }

      connection = await pool.getConnection()
      const [instructorRows] = await connection.execute(
        'SELECT bank_acc_no FROM instructor WHERE tid = ?',
        [instructorId]
      )

      if (instructorRows.length === 0 || !instructorRows[0].bank_acc_no) {
        connection.release()
        return res.status(404).json({
          success: false,
          message: 'Instructor not found or payment not set up',
        })
      }

      const accountNo = instructorRows[0].bank_acc_no

      const balanceResponse = await fetch('http://localhost:3000/bank-api/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_no: accountNo }),
      })
      const balanceData = await balanceResponse.json()

      const transactionsResponse = await fetch(`http://localhost:3000/bank-api/transactions/${accountNo}`)
      const transactionsData = await transactionsResponse.json()

      connection.release()

      res.json({
        success: true,
        balance: balanceData.balance || 0,
        transactions: transactionsData.success ? transactionsData.transactions : [],
      })
    } catch (error) {
      console.error('Get instructor transactions error:', error)
      if (connection) {
        connection.release()
      }
      res.status(500).json({
        success: false,
        message: 'Server error',
      })
    }
  })

  router.get('/admin/transactions', async (req, res) => {
    try {
      const balanceResponse = await fetch('http://localhost:3000/bank-api/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_no: LMS_ACCOUNT }),
      })
      const balanceData = await balanceResponse.json()

      const transactionsResponse = await fetch(`http://localhost:3000/bank-api/transactions/${LMS_ACCOUNT}`)
      const transactionsData = await transactionsResponse.json()

      res.json({
        success: true,
        accountNo: LMS_ACCOUNT,
        balance: balanceData.balance || 0,
        transactions: transactionsData.success ? transactionsData.transactions : [],
      })
    } catch (error) {
      console.error('Get admin LMS transactions error:', error)
      res.status(500).json({
        success: false,
        message: 'Server error',
      })
    }
  })

  return router
}
