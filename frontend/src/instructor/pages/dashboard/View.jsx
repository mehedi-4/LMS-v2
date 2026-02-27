import { useState, useEffect } from 'react'

export default function View({ user }) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedCourse, setExpandedCourse] = useState(null)
  const [expandedLecture, setExpandedLecture] = useState(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`http://localhost:5006/api/courses/instructor/${user?.id}`)
      const data = await response.json()

      if (data.success) {
        setCourses(data.courses)
      } else {
        setError(data.message || 'Failed to fetch courses')
      }
    } catch (err) {
      setError('Error fetching courses: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleCourseExpand = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId)
    setExpandedLecture(null)
  }

  const toggleLectureExpand = (lectureId) => {
    setExpandedLecture(expandedLecture === lectureId ? null : lectureId)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-slate-100">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
          <p className="text-slate-600 mt-4 font-medium">Loading your courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-amber-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Courses</h2>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}

        {courses.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">No courses yet</h3>
            <p className="text-slate-500 mt-2">Start by uploading your first course to see it here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {courses.map((course) => (
              <div key={course.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
                {/* Course Header */}
                <button
                  onClick={() => toggleCourseExpand(course.id)}
                  className="w-full p-6 flex justify-between items-start text-left group hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 pr-8">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{course.title}</h3>
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-bold">
                        ${course.price}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">{course.description}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition-transform duration-300 ${expandedCourse === course.id ? 'rotate-180 bg-amber-100 text-amber-600' : 'text-slate-400'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Course Details */}
                {expandedCourse === course.id && (
                  <div className="border-t border-slate-100 bg-slate-50/50 animate-fadeIn">
                    {/* Course Info */}
                    <div className="p-8 border-b border-slate-100">
                      <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Course Description
                      </h4>
                      <p className="text-slate-600 whitespace-pre-wrap leading-relaxed pl-7">{course.description}</p>
                    </div>

                    {/* Lectures */}
                    <div className="p-8">
                      <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        Lectures ({course.lectures?.length || 0})
                      </h4>

                      {course.lectures && course.lectures.length > 0 ? (
                        <div className="space-y-4">
                          {course.lectures.map((lecture) => (
                            <div key={lecture.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                              {/* Lecture Header */}
                              <button
                                onClick={() => toggleLectureExpand(lecture.id)}
                                className="w-full p-5 flex justify-between items-center hover:bg-slate-50 transition-colors text-left"
                              >
                                <div>
                                  <p className="font-bold text-slate-900 flex items-center gap-2">
                                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">#{lecture.lecture_number}</span>
                                    {lecture.title}
                                  </p>
                                  {lecture.video_path && (
                                    <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1 ml-9">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                      Video included
                                    </p>
                                  )}
                                </div>
                                <svg
                                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                                    expandedLecture === lecture.id ? 'rotate-180 text-amber-500' : ''
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>

                              {/* Lecture Details */}
                              {expandedLecture === lecture.id && (
                                <div className="border-t border-slate-100 p-6 space-y-6 bg-slate-50/30">
                                  {/* Video Player */}
                                  {lecture.video_path && (
                                    <div>
                                      <p className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Video Content</p>
                                      <div className="rounded-xl overflow-hidden shadow-lg bg-black">
                                        <video
                                          controls
                                          className="w-full max-h-96"
                                          src={`http://localhost:5006${lecture.video_path}`}
                                        >
                                          Your browser does not support the video tag.
                                        </video>
                                      </div>
                                    </div>
                                  )}

                                  {/* Materials */}
                                  {lecture.materials && lecture.materials.length > 0 && (
                                    <div>
                                      <p className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Course Materials</p>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {lecture.materials.map((material) => (
                                          <a
                                            key={material.id}
                                            href={`http://localhost:5006${material.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center p-4 bg-white border border-slate-200 hover:border-amber-500 hover:shadow-md rounded-xl transition-all group"
                                          >
                                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors mr-3">
                                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className="font-bold text-slate-900 truncate group-hover:text-amber-600 transition-colors">
                                                {material.file_name}
                                              </p>
                                              <p className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">{material.material_type}</p>
                                            </div>
                                            <svg className="w-5 h-5 text-slate-300 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {!lecture.video_path && (!lecture.materials || lecture.materials.length === 0) && (
                                    <div className="text-center py-8 bg-slate-100 rounded-xl border border-dashed border-slate-300">
                                      <p className="text-slate-500 italic">No content available for this lecture</p>
                                    </div>
                                  )}

                                  {/* Quiz Section */}
                                  {lecture.quizzes && lecture.quizzes.length > 0 && (
                                    <div className="pt-6 border-t border-slate-200">
                                      <p className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                                        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                        Quiz Questions ({lecture.quizzes.length})
                                      </p>
                                      <div className="space-y-4">
                                        {lecture.quizzes.map((quiz, qIdx) => (
                                          <div key={quiz.id} className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
                                            <p className="font-bold text-slate-800 mb-4 flex items-start gap-2">
                                              <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md mt-0.5">Q{qIdx + 1}</span>
                                              {quiz.question}
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                              {['A', 'B', 'C', 'D'].map((opt) => {
                                                const isCorrect = quiz.correct_answer === opt;
                                                const optionText = quiz[`option_${opt.toLowerCase()}`];
                                                return (
                                                  <div key={opt} className={`p-3 rounded-lg border flex items-center justify-between ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-100'}`}>
                                                    <div className="flex items-center gap-3">
                                                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCorrect ? 'bg-green-200 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                                                        {opt}
                                                      </span>
                                                      <span className={`text-sm ${isCorrect ? 'text-green-800 font-medium' : 'text-slate-600'}`}>
                                                        {optionText}
                                                      </span>
                                                    </div>
                                                    {isCorrect && (
                                                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                    )}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                          <p className="text-slate-500 italic">No lectures added to this course</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
