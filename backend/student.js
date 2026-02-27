const express = require('express')

module.exports = function createStudentRouter({ pool }) {
  const router = express.Router()

  router.post('/student/login', async (req, res) => {
    let connection
    try {
      const { username, password } = req.body

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username and password are required',
        })
      }

      connection = await pool.getConnection()
      const [rows] = await connection.execute('SELECT * FROM student WHERE username = ?', [username])

      if (rows.length === 0 || rows[0].password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password',
        })
      }

      const student = rows[0]

      res.json({
        success: true,
        message: 'Login successful',
        student: {
          id: student.uid,
          username: student.username,
          paymentSetup: student.payment_setup,
          bankAccNo: student.bank_acc_no,
          bankSecretKey: student.bank_secret_key,
        },
      })
    } catch (error) {
      console.error('Student login error:', error)
      res.status(500).json({
        success: false,
        message: 'Server error',
      })
    } finally {
      if (connection) {
        connection.release()
      }
    }
  })

  router.post('/student/signup', async (req, res) => {
    let connection
    try {
      const { username, password } = req.body

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username and password are required',
        })
      }

      connection = await pool.getConnection()
      const [existing] = await connection.execute('SELECT uid FROM student WHERE username = ?', [username])

      if (existing.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Username already taken',
        })
      }

      const [result] = await connection.execute(
        'INSERT INTO student (username, password, payment_setup) VALUES (?, ?, 0)',
        [username, password]
      )

      res.json({
        success: true,
        message: 'Account created successfully',
        student: {
          id: result.insertId,
          username,
          paymentSetup: 0,
          bankAccNo: null,
          bankSecretKey: null,
        },
      })
    } catch (error) {
      console.error('Student signup error:', error)
      res.status(500).json({
        success: false,
        message: 'Server error',
      })
    } finally {
      if (connection) {
        connection.release()
      }
    }
  })

  router.post('/student/payment-setup', async (req, res) => {
    let connection
    try {
      const { username, bankAccNo, bankSecretKey } = req.body

      if (!username || !bankAccNo || !bankSecretKey) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required',
        })
      }

      connection = await pool.getConnection()
      await connection.execute(
        'UPDATE student SET bank_acc_no = ?, bank_secret_key = ?, payment_setup = 1 WHERE username = ?',
        [bankAccNo, bankSecretKey, username]
      )

      const [rows] = await connection.execute('SELECT * FROM student WHERE username = ?', [username])
      const student = rows[0]

      res.json({
        success: true,
        message: 'Payment setup saved successfully',
        student: {
          username: student.username,
          paymentSetup: student.payment_setup,
          bankAccNo: student.bank_acc_no,
          bankSecretKey: student.bank_secret_key,
        },
      })
    } catch (error) {
      console.error('Student payment setup error:', error)
      res.status(500).json({
        success: false,
        message: 'Server error',
      })
    } finally {
      if (connection) {
        connection.release()
      }
    }
  })

  router.get('/courses', async (req, res) => {
    let connection
    try {
      connection = await pool.getConnection()

      const [courses] = await connection.execute(
        `SELECT c.cid AS id, c.course_name AS title, c.description, c.price, c.instructor_id,
       i.username AS instructor_username
       FROM course c
       LEFT JOIN instructor i ON c.instructor_id = i.tid
       ORDER BY c.cid DESC`
      )

      connection.release()

      res.json({
        success: true,
        courses,
      })
    } catch (error) {
      console.error('Get courses error:', error)
      if (connection) {
        connection.release()
      }
      res.status(500).json({
        success: false,
        message: 'Server error',
      })
    }
  })

  router.post('/student/enroll', async (req, res) => {
    let connection
    try {
      const { studentId, courseId } = req.body

      if (!studentId || !courseId) {
        return res.status(400).json({
          success: false,
          message: 'Student ID and Course ID are required',
        })
      }

      connection = await pool.getConnection()

      const [existing] = await connection.execute(
        'SELECT eid FROM enrollment WHERE student_id = ? AND course_id = ?',
        [studentId, courseId]
      )

      if (existing.length > 0) {
        connection.release()
        return res.status(409).json({
          success: false,
          message: 'You are already enrolled in this course',
        })
      }

      const [courseRows] = await connection.execute(
        'SELECT price, instructor_id FROM course WHERE cid = ?',
        [courseId]
      )

      if (courseRows.length === 0) {
        connection.release()
        return res.status(404).json({
          success: false,
          message: 'Course not found',
        })
      }

      const coursePrice = parseFloat(courseRows[0].price || 0)
      const instructorId = courseRows[0].instructor_id

      const [studentRows] = await connection.execute(
        'SELECT bank_acc_no, bank_secret_key, payment_setup FROM student WHERE uid = ?',
        [studentId]
      )

      if (studentRows.length === 0) {
        connection.release()
        return res.status(404).json({
          success: false,
          message: 'Student not found',
        })
      }

      const student = studentRows[0]

      if (!student.payment_setup || !student.bank_acc_no || !student.bank_secret_key) {
        connection.release()
        return res.status(400).json({
          success: false,
          message: 'Payment setup is required. Please set up your payment information first.',
        })
      }

      if (coursePrice > 0) {
        try {
          const bankResponse = await fetch('http://localhost:3000/bank-api/transfer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from_account_no: student.bank_acc_no,
              secret_key: student.bank_secret_key,
              amount: coursePrice,
            }),
          })

          const bankData = await bankResponse.json()

          if (!bankData.success) {
            connection.release()
            return res.status(400).json({
              success: false,
              message: bankData.error || 'Payment processing failed',
            })
          }

          const instructorShare = coursePrice * 0.5
          if (instructorShare > 0) {
            const [instructorRows] = await connection.execute(
              'SELECT bank_acc_no, payment_setup FROM instructor WHERE tid = ?',
              [instructorId]
            )

            if (instructorRows.length > 0 && instructorRows[0].payment_setup && instructorRows[0].bank_acc_no) {
              try {
                const instructorTransferResponse = await fetch('http://localhost:3000/bank-api/transfer-lms-to-instructor', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    to_account_no: instructorRows[0].bank_acc_no,
                    amount: instructorShare,
                  }),
                })

                await instructorTransferResponse.json()
              } catch (instructorTransferError) {
                console.error('Bank API error for instructor transfer:', instructorTransferError)
              }
            }
          }
        } catch (bankError) {
          console.error('Bank API error:', bankError)
          connection.release()
          return res.status(500).json({
            success: false,
            message: 'Unable to process payment. Please try again later.',
          })
        }
      }

      const [result] = await connection.execute(
        'INSERT INTO enrollment (student_id, course_id, enrollment_date) VALUES (?, ?, NOW())',
        [studentId, courseId]
      )

      connection.release()

      res.json({
        success: true,
        message: 'Enrolled successfully',
        enrollmentId: result.insertId,
      })
    } catch (error) {
      console.error('Enrollment error:', error)
      if (connection) {
        connection.release()
      }
      res.status(500).json({
        success: false,
        message: 'Server error',
      })
    }
  })

  router.post('/student/lecture/toggle-complete', async (req, res) => {
    let connection
    try {
      const { studentId, lectureId, isCompleted } = req.body

      if (!studentId || !lectureId) {
        return res.status(400).json({
          success: false,
          message: 'Student ID and Lecture ID are required',
        })
      }

      connection = await pool.getConnection()

      const [existing] = await connection.execute(
        'SELECT * FROM student_lecture_progress WHERE student_id = ? AND lecture_id = ?',
        [studentId, lectureId]
      )

      if (existing.length > 0) {
        await connection.execute(
          'UPDATE student_lecture_progress SET is_completed = ?, completed_at = ? WHERE student_id = ? AND lecture_id = ?',
          [isCompleted, isCompleted ? new Date() : null, studentId, lectureId]
        )
      } else {
        await connection.execute(
          'INSERT INTO student_lecture_progress (student_id, lecture_id, is_completed, completed_at) VALUES (?, ?, ?, ?)',
          [studentId, lectureId, isCompleted, isCompleted ? new Date() : null]
        )
      }

      connection.release()

      res.json({
        success: true,
        message: 'Lecture progress updated',
      })
    } catch (error) {
      console.error('Toggle lecture complete error:', error)
      if (connection) {
        connection.release()
      }
      res.status(500).json({
        success: false,
        message: 'Server error',
      })
    }
  })

  router.get('/student/:studentId/enrollments', async (req, res) => {
    let connection
    try {
      const { studentId } = req.params

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: 'Student ID is required',
        })
      }

      connection = await pool.getConnection()

      const [enrollments] = await connection.execute(
        `SELECT e.eid, e.enrollment_date, e.course_id,
       c.course_name AS title, c.description, c.price, c.instructor_id,
       i.username AS instructor_username
       FROM enrollment e
       JOIN course c ON e.course_id = c.cid
       LEFT JOIN instructor i ON c.instructor_id = i.tid
       WHERE e.student_id = ?
       ORDER BY e.enrollment_date DESC`,
        [studentId]
      )

      for (const enrollment of enrollments) {
        const [lectures] = await connection.execute(
          'SELECT * FROM course_lecture WHERE course_id = ? ORDER BY lecture_number ASC',
          [enrollment.course_id]
        )

        let completedCount = 0

        for (const lecture of lectures) {
          const [materials] = await connection.execute(
            'SELECT * FROM course_material WHERE lecture_id = ? ORDER BY created_at ASC',
            [lecture.id]
          )
          lecture.materials = materials

          const [progress] = await connection.execute(
            'SELECT is_completed FROM student_lecture_progress WHERE student_id = ? AND lecture_id = ?',
            [studentId, lecture.id]
          )

          lecture.is_completed = progress.length > 0 && !!progress[0].is_completed
          if (lecture.is_completed) {
            completedCount++
          }
        }

        enrollment.lectures = lectures
        enrollment.total_lectures = lectures.length
        enrollment.completed_lectures = completedCount
        enrollment.progress_percentage = lectures.length > 0
          ? Math.round((completedCount / lectures.length) * 100)
          : 0
      }

      connection.release()

      res.json({
        success: true,
        enrollments,
      })
    } catch (error) {
      console.error('Get enrollments error:', error)
      if (connection) {
        connection.release()
      }
      res.status(500).json({
        success: false,
        message: 'Server error',
      })
    }
  })

  router.get('/student/:studentId/transactions', async (req, res) => {
    let connection
    try {
      const { studentId } = req.params

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: 'Student ID is required',
        })
      }

      connection = await pool.getConnection()

      const [studentRows] = await connection.execute(
        'SELECT bank_acc_no FROM student WHERE uid = ?',
        [studentId]
      )

      if (studentRows.length === 0 || !studentRows[0].bank_acc_no) {
        connection.release()
        return res.status(404).json({
          success: false,
          message: 'Student not found or payment not set up',
        })
      }

      const accountNo = studentRows[0].bank_acc_no

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
      console.error('Get student transactions error:', error)
      if (connection) {
        connection.release()
      }
      res.status(500).json({
        success: false,
        message: 'Server error',
      })
    }
  })

  router.post('/student/quiz/submit', async (req, res) => {
    let connection
    try {
      const { studentId, lectureId, answers } = req.body

      if (!studentId || !lectureId || !answers || !Array.isArray(answers)) {
        return res.status(400).json({
          success: false,
          message: 'Student ID, lecture ID, and answers array are required',
        })
      }

      connection = await pool.getConnection()
      await connection.beginTransaction()

      const [quizzes] = await connection.execute(
        'SELECT id, question, correct_answer FROM lecture_quiz WHERE lecture_id = ? ORDER BY id ASC',
        [lectureId]
      )

      if (quizzes.length === 0) {
        await connection.rollback()
        connection.release()
        return res.status(404).json({
          success: false,
          message: 'No quizzes found for this lecture',
        })
      }

      const [lectureInfo] = await connection.execute(
        'SELECT course_id FROM course_lecture WHERE id = ?',
        [lectureId]
      )

      if (lectureInfo.length === 0) {
        await connection.rollback()
        connection.release()
        return res.status(404).json({
          success: false,
          message: 'Lecture not found',
        })
      }

      const courseId = lectureInfo[0].course_id

      await connection.execute(
        'DELETE FROM student_quiz_attempt WHERE student_id = ? AND lecture_id = ?',
        [studentId, lectureId]
      )

      let correctCount = 0
      let totalCount = 0

      for (let i = 0; i < answers.length && i < quizzes.length; i++) {
        const quiz = quizzes[i]
        const selectedAnswer = answers[i]
        const isCorrect = selectedAnswer === quiz.correct_answer

        if (isCorrect) correctCount++
        totalCount++

        await connection.execute(
          'INSERT INTO student_quiz_attempt (student_id, lecture_id, quiz_id, selected_answer, is_correct) VALUES (?, ?, ?, ?, ?)',
          [studentId, lectureId, quiz.id, selectedAnswer, isCorrect]
        )
      }

      const [allAttempts] = await connection.execute(
        `SELECT COUNT(*) as total, SUM(is_correct) as correct
       FROM student_quiz_attempt sqa
       JOIN course_lecture cl ON sqa.lecture_id = cl.id
       WHERE sqa.student_id = ? AND cl.course_id = ?`,
        [studentId, courseId]
      )

      const totalQuizzes = allAttempts[0].total || 0
      const correctAnswers = allAttempts[0].correct || 0
      const percentageScore = totalQuizzes > 0 ? (correctAnswers / totalQuizzes) * 100 : 0

      const [lecturesWithQuizzes] = await connection.execute(
        `SELECT COUNT(DISTINCT cl.id) as total_lectures
       FROM course_lecture cl
       JOIN lecture_quiz lq ON cl.id = lq.lecture_id
       WHERE cl.course_id = ?`,
        [courseId]
      )

      const [completedLectures] = await connection.execute(
        `SELECT COUNT(DISTINCT sqa.lecture_id) as completed_lectures
       FROM student_quiz_attempt sqa
       JOIN course_lecture cl ON sqa.lecture_id = cl.id
       WHERE sqa.student_id = ? AND cl.course_id = ?`,
        [studentId, courseId]
      )

      const totalLecturesWithQuizzes = lecturesWithQuizzes[0].total_lectures || 0
      const studentCompletedLectures = completedLectures[0].completed_lectures || 0
      const allLecturesCompleted = totalLecturesWithQuizzes > 0 && studentCompletedLectures >= totalLecturesWithQuizzes

      await connection.execute(
        `INSERT INTO student_course_score (student_id, course_id, total_quizzes, correct_answers, percentage_score)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       total_quizzes = VALUES(total_quizzes),
       correct_answers = VALUES(correct_answers),
       percentage_score = VALUES(percentage_score)`,
        [studentId, courseId, totalQuizzes, correctAnswers, percentageScore]
      )

      let certificateEarned = false
      if (allLecturesCompleted && percentageScore >= 80) {
        const validationCode = `CERT-${courseId}-${studentId}-${Date.now()}`

        await connection.execute(
          `INSERT INTO student_certificate (student_id, course_id, validation_code, percentage_score)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         validation_code = VALUES(validation_code),
         percentage_score = VALUES(percentage_score),
         issued_at = CURRENT_TIMESTAMP`,
          [studentId, courseId, validationCode, percentageScore]
        )
        certificateEarned = true
      }

      await connection.commit()
      connection.release()

      res.json({
        success: true,
        message: 'Quiz submitted successfully',
        lectureScore: {
          correct: correctCount,
          total: totalCount,
          percentage: totalCount > 0 ? (correctCount / totalCount) * 100 : 0,
        },
        courseScore: {
          total: totalQuizzes,
          correct: correctAnswers,
          percentage: percentageScore,
        },
        courseProgress: {
          completedLectures: studentCompletedLectures,
          totalLectures: totalLecturesWithQuizzes,
          allCompleted: allLecturesCompleted,
        },
        certificateEarned,
      })
    } catch (error) {
      console.error('Quiz submission error:', error)
      if (connection) {
        await connection.rollback()
        connection.release()
      }
      res.status(500).json({
        success: false,
        message: 'Server error: ' + error.message,
      })
    }
  })

  router.get('/student/:studentId/scores', async (req, res) => {
    let connection
    try {
      const { studentId } = req.params

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: 'Student ID is required',
        })
      }

      connection = await pool.getConnection()

      const [courses] = await connection.execute(
        `SELECT 
        c.cid as course_id,
        c.course_name as title,
        c.description,
        i.username as instructor_name,
        e.enrollment_date,
        COALESCE(scs.percentage_score, 0) as percentage_score,
        COALESCE(scs.total_quizzes, 0) as total_quizzes,
        COALESCE(scs.correct_answers, 0) as correct_answers,
        sc.validation_code,
        sc.issued_at as certificate_issued_at
       FROM enrollment e
       JOIN course c ON e.course_id = c.cid
       LEFT JOIN instructor i ON c.instructor_id = i.tid
       LEFT JOIN student_course_score scs ON scs.student_id = e.student_id AND scs.course_id = c.cid
       LEFT JOIN student_certificate sc ON sc.student_id = e.student_id AND sc.course_id = c.cid
       WHERE e.student_id = ?
       ORDER BY e.enrollment_date DESC`,
        [studentId]
      )

      connection.release()

      res.json({
        success: true,
        courses,
      })
    } catch (error) {
      console.error('Get student scores error:', error)
      if (connection) {
        connection.release()
      }
      res.status(500).json({
        success: false,
        message: 'Server error',
      })
    }
  })

  router.get('/lecture/:lectureId/quizzes', async (req, res) => {
    let connection
    try {
      const { lectureId } = req.params

      if (!lectureId) {
        return res.status(400).json({
          success: false,
          message: 'Lecture ID is required',
        })
      }

      connection = await pool.getConnection()

      const [quizzes] = await connection.execute(
        'SELECT id, question, option_a, option_b, option_c, option_d FROM lecture_quiz WHERE lecture_id = ? ORDER BY id ASC',
        [lectureId]
      )

      connection.release()

      res.json({
        success: true,
        quizzes,
      })
    } catch (error) {
      console.error('Get lecture quizzes error:', error)
      if (connection) {
        connection.release()
      }
      res.status(500).json({
        success: false,
        message: 'Server error',
      })
    }
  })

  router.post('/student/certificate/download', async (req, res) => {
    try {
      const { studentName, courseName, percentage } = req.body

      if (!studentName || !courseName || percentage === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Student name, course name, and percentage are required',
        })
      }

      const issueDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      const certificateHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Certificate of Accomplishment - ${studentName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Lato:wght@300;400;700&display=swap');
    @page { size: A4 landscape; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body {
      width: 297mm;
      height: 210mm;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f0f2f5;
      font-family: 'Lato', sans-serif;
    }
    .certificate-container {
      width: 297mm;
      height: 210mm;
      padding: 10mm;
      background: #fff;
      position: relative;
      overflow: hidden;
    }
    .certificate-border {
      width: 100%;
      height: 100%;
      border: 2px solid #0f172a;
      position: relative;
      padding: 10mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #fff;
    }
    .certificate-border::before {
      content: '';
      position: absolute;
      top: 4px;
      left: 4px;
      right: 4px;
      bottom: 4px;
      border: 1px solid #fbbf24;
      pointer-events: none;
    }
    .corner-decoration { position: absolute; width: 40px; height: 40px; border: 4px solid #0f172a; z-index: 10; }
    .top-left { top: -2px; left: -2px; border-right: none; border-bottom: none; }
    .top-right { top: -2px; right: -2px; border-left: none; border-bottom: none; }
    .bottom-left { bottom: -2px; left: -2px; border-right: none; border-top: none; }
    .bottom-right { bottom: -2px; right: -2px; border-left: none; border-top: none; }
    .header { text-align: center; margin-top: 10mm; }
    .logo { font-family: 'Cinzel', serif; font-size: 24pt; font-weight: 700; color: #0f172a; letter-spacing: 2px; margin-bottom: 5mm; }
    .academy-sub { font-size: 10pt; text-transform: uppercase; letter-spacing: 4px; color: #64748b; }
    .main-content { text-align: center; flex-grow: 1; display: flex; flex-direction: column; justify-content: center; }
    .cert-title { font-family: 'Cinzel', serif; font-size: 36pt; color: #0f172a; margin-bottom: 10mm; text-transform: uppercase; letter-spacing: 1px; }
    .cert-text { font-size: 14pt; color: #475569; margin: 2mm 0; }
    .student-name {
      font-family: 'Cinzel', serif;
      font-size: 32pt;
      color: #b45309;
      margin: 5mm 0;
      border-bottom: 1px solid #e2e8f0;
      display: inline-block;
      padding: 0 20mm 2mm;
    }
    .course-title { font-size: 20pt; font-weight: 700; color: #0f172a; margin: 5mm 0; }
    .score-badge {
      display: inline-block;
      margin-top: 5mm;
      padding: 2mm 6mm;
      border: 1px solid #fbbf24;
      border-radius: 50px;
      color: #b45309;
      font-weight: 700;
      font-size: 12pt;
      background: #fffbeb;
    }
    .prayer-text { margin-top: 10mm; font-style: italic; color: #64748b; font-size: 12pt; }
    .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 10mm; padding: 0 20mm; }
    .signature-block { text-align: center; }
    .signature-line { width: 60mm; border-top: 1px solid #0f172a; margin-bottom: 2mm; }
    .signature-label { font-size: 10pt; text-transform: uppercase; letter-spacing: 1px; color: #64748b; }
    .seal-container {
      width: 30mm;
      height: 30mm;
      border: 2px solid #fbbf24;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #b45309;
      font-weight: 700;
      font-size: 8pt;
      text-transform: uppercase;
      text-align: center;
      letter-spacing: 1px;
      box-shadow: 0 0 0 4px #fffbeb inset;
    }
    @media print {
      body { background: none; }
      .certificate-container { width: 297mm; height: 210mm; page-break-after: always; }
    }
  </style>
</head>
<body>
  <div class="certificate-container">
    <div class="certificate-border">
      <div class="corner-decoration top-left"></div>
      <div class="corner-decoration top-right"></div>
      <div class="corner-decoration bottom-left"></div>
      <div class="corner-decoration bottom-right"></div>

      <div class="header">
        <div class="logo">LMS Academy</div>
        <div class="academy-sub">Excellence in Education</div>
      </div>

      <div class="main-content">
        <div class="cert-title">Certificate of Completion</div>
        <p class="cert-text">This certifies that</p>
        <div class="student-name">${studentName}</div>
        <p class="cert-text">has successfully completed the course</p>
        <div class="course-title">${courseName}</div>
        <div class="score-badge">Score: ${Number(percentage).toFixed(1)}%</div>
        <div class="prayer-text">"We pray for your continued success in all your future endeavors."</div>
      </div>

      <div class="footer">
        <div class="signature-block">
          <div class="signature-line"></div>
          <div class="signature-label">Date: ${issueDate}</div>
        </div>

        <div class="seal-container">
          Official<br>Seal
        </div>

        <div class="signature-block">
          <div class="signature-line"></div>
          <div class="signature-label">LMS Academy Director</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 800);
    };
  </script>
</body>
</html>
      `

      res.setHeader('Content-Type', 'text/html')
      res.send(certificateHTML)
    } catch (error) {
      console.error('Certificate download error:', error)
      res.status(500).json({
        success: false,
        message: 'Server error: ' + error.message,
      })
    }
  })

  return router
}
