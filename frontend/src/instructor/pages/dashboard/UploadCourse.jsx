import { useState } from 'react'

export default function UploadCourse({ user }) {
  const [step, setStep] = useState(1)
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    numberOfLectures: '',
    price: '',
  })
  const [lectures, setLectures] = useState([])
  const [currentLecture, setCurrentLecture] = useState(0)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [quizzesPerLecture, setQuizzesPerLecture] = useState(1)

  const handleCourseChange = (e) => {
    const { name, value } = e.target
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleStep1Submit = (e) => {
    e.preventDefault()
    if (!courseData.title || !courseData.description || !courseData.numberOfLectures || !courseData.price) {
      setMessageType('error')
      setMessage('Please fill in all fields')
      return
    }

    if (!quizzesPerLecture || quizzesPerLecture < 0) {
      setMessageType('error')
      setMessage('Please specify how many quiz questions per lecture')
      return
    }

    const lectureCount = parseInt(courseData.numberOfLectures)
    const quizCount = parseInt(quizzesPerLecture)
    const newLectures = Array.from({ length: lectureCount }, (_, i) => ({
      id: i + 1,
      title: '',
      video: null,
      materials: [],
      quizzes: Array.from({ length: quizCount }, () => ({
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
      })),
    }))
    setLectures(newLectures)
    setCurrentLecture(0)
    setStep(2)
    setMessage('')
  }

  const resetBanner = () => {
    setMessage('')
    setMessageType('')
  }

  const handleLectureChange = (field, value) => {
    setLectures((prev) =>
      prev.map((lecture, idx) =>
        idx === currentLecture
          ? {
              ...lecture,
              [field]: value,
            }
          : lecture
      )
    )
  }

  const handleMaterialUpload = (e) => {
    const files = Array.from(e.target.files)
    setLectures((prev) =>
      prev.map((lecture, idx) =>
        idx === currentLecture
          ? {
              ...lecture,
              materials: [...lecture.materials, ...files],
            }
          : lecture
      )
    )
    e.target.value = ''
  }

  const handleVideoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleLectureChange('video', file)
    }
    e.target.value = ''
  }

  const handleRemoveMaterial = (indexToRemove) => {
    setLectures((prev) =>
      prev.map((lecture, idx) =>
        idx === currentLecture
          ? {
              ...lecture,
              materials: lecture.materials.filter((_, idx2) => idx2 !== indexToRemove),
            }
          : lecture
      )
    )
  }

  const handleQuizChange = (quizIndex, field, value) => {
    setLectures((prev) =>
      prev.map((lecture, idx) =>
        idx === currentLecture
          ? {
              ...lecture,
              quizzes: lecture.quizzes.map((quiz, qIdx) =>
                qIdx === quizIndex ? { ...quiz, [field]: value } : quiz
              ),
            }
          : lecture
      )
    )
  }

  const handleNextLecture = () => {
    if (!lectures[currentLecture].title || !lectures[currentLecture].video) {
      setMessageType('error')
      setMessage('Please add lecture title and video before proceeding')
      return
    }
    const currentQuizzes = lectures[currentLecture].quizzes || []
    for (let i = 0; i < currentQuizzes.length; i++) {
      const quiz = currentQuizzes[i]
      if (!quiz.question || !quiz.optionA || !quiz.optionB || !quiz.optionC || !quiz.optionD) {
        setMessageType('error')
        setMessage(`Please fill in all quiz fields for question ${i + 1}`)
        return
      }
    }
    if (currentLecture < lectures.length - 1) {
      setCurrentLecture(currentLecture + 1)
      resetBanner()
    }
  }

  const hasIncompleteLectures = () =>
    lectures.some((lecture) => {
      if (!lecture.title || !lecture.video) return true
      // Check if all quizzes are complete
      const quizzes = lecture.quizzes || []
      return quizzes.some(
        (quiz) => !quiz.question || !quiz.optionA || !quiz.optionB || !quiz.optionC || !quiz.optionD
      )
    })

  const handleSubmitCourse = async (e) => {
    e.preventDefault()
    setLoading(true)
    resetBanner()

    if (hasIncompleteLectures()) {
      setLoading(false)
      setMessageType('error')
      setMessage('Every lecture must include a title and a video.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('instructorId', user?.id)
      formData.append('title', courseData.title)
      formData.append('description', courseData.description)
      formData.append('numberOfLectures', lectures.length.toString())
      formData.append('price', courseData.price)

      // Add lectures
      lectures.forEach((lecture, index) => {
        formData.append(`lectures[${index}][title]`, lecture.title)
        formData.append(`lectures[${index}][video]`, lecture.video, lecture.video.name || `lecture-${index + 1}-video`)
        lecture.materials.forEach((material, materialIndex) => {
          formData.append(
            `lectures[${index}][materials]`,
            material,
            material.name || `lecture-${index + 1}-material-${materialIndex + 1}`
          )
        })
        
        const quizzes = lecture.quizzes || []
        quizzes.forEach((quiz, quizIndex) => {
          formData.append(`quiz_${index}_${quizIndex}_question`, quiz.question)
          formData.append(`quiz_${index}_${quizIndex}_optionA`, quiz.optionA)
          formData.append(`quiz_${index}_${quizIndex}_optionB`, quiz.optionB)
          formData.append(`quiz_${index}_${quizIndex}_optionC`, quiz.optionC)
          formData.append(`quiz_${index}_${quizIndex}_optionD`, quiz.optionD)
          formData.append(`quiz_${index}_${quizIndex}_correctAnswer`, quiz.correctAnswer)
        })
      })

      const response = await fetch('http://localhost:5006/api/courses/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setMessageType('success')
        setMessage('Course uploaded successfully!')
        setTimeout(() => {
          // Reset form
          setCourseData({
            title: '',
            description: '',
            numberOfLectures: '',
            price: '',
          })
          setLectures([])
          setCurrentLecture(0)
          setStep(1)
        }, 1500)
      } else {
        setMessageType('error')
        setMessage(data.message || 'Failed to upload course')
      }
    } catch (error) {
      setMessageType('error')
      setMessage('Error uploading course: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-amber-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Upload Course</h2>
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-6 animate-fadeIn">
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-slate-700 mb-2">
                Course Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={courseData.title}
                onChange={handleCourseChange}
                placeholder="Enter course title"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-bold text-slate-700 mb-2">
                Course Description
              </label>
              <textarea
                id="description"
                name="description"
                value={courseData.description}
                onChange={handleCourseChange}
                placeholder="Enter course description"
                rows="4"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="numberOfLectures" className="block text-sm font-bold text-slate-700 mb-2">
                  Number of Lectures
                </label>
                <input
                  id="numberOfLectures"
                  type="number"
                  name="numberOfLectures"
                  value={courseData.numberOfLectures}
                  onChange={handleCourseChange}
                  placeholder="e.g., 10"
                  min="1"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-bold text-slate-700 mb-2">
                  Course Price ($)
                </label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={courseData.price}
                  onChange={handleCourseChange}
                  placeholder="e.g., 99.99"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="quizzesPerLecture" className="block text-sm font-bold text-slate-700 mb-2">
                Quiz Questions per Lecture
              </label>
              <input
                id="quizzesPerLecture"
                type="number"
                value={quizzesPerLecture}
                onChange={(e) => setQuizzesPerLecture(e.target.value)}
                placeholder="e.g., 1"
                min="0"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              />
              <p className="text-sm text-slate-500 mt-2">Set to 0 if you don't want to add quizzes</p>
            </div>

            {message && (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : ''}`}>
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="font-medium">{message}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-4 rounded-xl hover:bg-slate-800 transition-all duration-200 font-bold shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 group"
            >
              Next: Upload Lectures
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          </form>
        )}

        {step === 2 && lectures.length > 0 && (
          <form onSubmit={handleSubmitCourse} className="space-y-8 animate-fadeIn">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  Lecture {currentLecture + 1} of {lectures.length}
                </h3>
                <p className="text-slate-500 text-sm">Fill in the details for this lecture</p>
              </div>
              <div className="flex gap-1">
                {lectures.map((_, idx) => (
                  <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentLecture ? 'bg-amber-500' : idx < currentLecture ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="lectureTitle" className="block text-sm font-bold text-slate-700 mb-2">
                  Lecture Title
                </label>
                <input
                  id="lectureTitle"
                  type="text"
                  value={lectures[currentLecture].title}
                  onChange={(e) => handleLectureChange('title', e.target.value)}
                  placeholder="Enter lecture title"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="video" className="block text-sm font-bold text-slate-700 mb-2">
                  Upload Video Lecture
                </label>
                <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-amber-500 transition-colors bg-slate-50">
                  <input
                    id="video"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    <p className="text-slate-600 font-medium">Click to upload video</p>
                    <p className="text-slate-400 text-sm mt-1">MP4, WebM, or Ogg</p>
                  </div>
                </div>
                {lectures[currentLecture].video && (
                  <div className="mt-3 flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="font-medium text-sm truncate">{lectures[currentLecture].video.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="materials" className="block text-sm font-bold text-slate-700 mb-2">
                  Upload Course Materials
                </label>
                <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-amber-500 transition-colors bg-slate-50">
                  <input
                    id="materials"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.mp3,.wav,.zip"
                    multiple
                    onChange={handleMaterialUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <p className="text-slate-600 font-medium text-sm">Click to upload materials (PDF, Images, etc.)</p>
                  </div>
                </div>
                
                {lectures[currentLecture].materials.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attached Materials</p>
                    {lectures[currentLecture].materials.map((material, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                          <span className="text-sm text-slate-700 truncate">{material.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(idx)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {lectures[currentLecture].quizzes && lectures[currentLecture].quizzes.length > 0 && (
              <div className="space-y-6 border-t border-slate-200 pt-8 mt-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Quiz Questions</h3>
                </div>
                
                {lectures[currentLecture].quizzes.map((quiz, quizIndex) => (
                  <div key={quizIndex} className="border border-slate-200 rounded-xl p-6 bg-slate-50/50">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-md">Q{quizIndex + 1}</span>
                      Question Details
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                          Question Text
                        </label>
                        <input
                          type="text"
                          value={quiz.question}
                          onChange={(e) => handleQuizChange(quizIndex, 'question', e.target.value)}
                          placeholder="Enter the question"
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['A', 'B', 'C', 'D'].map((opt) => (
                          <div key={opt}>
                            <label className="block text-sm font-bold text-slate-700 mb-1">
                              Option {opt}
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">{opt}</span>
                              <input
                                type="text"
                                value={quiz[`option${opt}`]}
                                onChange={(e) => handleQuizChange(quizIndex, `option${opt}`, e.target.value)}
                                placeholder={`Enter option ${opt}`}
                                className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                          Correct Answer
                        </label>
                        <select
                          value={quiz.correctAnswer}
                          onChange={(e) => handleQuizChange(quizIndex, 'correctAnswer', e.target.value)}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                        >
                          <option value="A">Option A</option>
                          <option value="B">Option B</option>
                          <option value="C">Option C</option>
                          <option value="D">Option D</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {message && (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                {messageType === 'error' ? (
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ) : (
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                )}
                <p className="font-medium">{message}</p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              {currentLecture < lectures.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextLecture}
                  className="flex-1 bg-slate-900 text-white py-3.5 rounded-xl hover:bg-slate-800 transition font-bold shadow-lg shadow-slate-900/20"
                >
                  Next Lecture
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-3.5 rounded-xl hover:bg-green-700 transition font-bold shadow-lg shadow-green-600/20 disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    'Complete & Upload Course'
                  )}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}