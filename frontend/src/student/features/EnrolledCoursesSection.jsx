import { useEffect, useState } from 'react'
import QuizModal from './QuizModal'

export default function EnrolledCoursesSection({ student }) {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (student?.id) {
      fetchEnrollments()
    }
  }, [student?.id])

  const fetchEnrollments = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`http://localhost:5006/api/student/${student.id}/enrollments`)
      const data = await response.json()

      if (data.success) {
        setEnrollments(data.enrollments)
      } else {
        setError(data.message || 'Failed to fetch enrollments')
      }
    } catch (err) {
      setError('Error fetching enrollments: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Enrolled Courses</h1>
        <p className="text-slate-500 mt-2 text-lg">Continue your learning journey.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-900"></div>
          </div>
          <p className="text-slate-500 mt-4 font-medium">Loading enrolled courses...</p>
        </div>
      ) : enrollments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <p className="text-slate-500 text-lg">You haven't enrolled in any courses yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {enrollments.map((enrollment) => (
            <EnrolledCourseCard 
              key={enrollment.eid} 
              enrollment={enrollment} 
              student={student}
              onProgressUpdate={fetchEnrollments}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function EnrolledCourseCard({ enrollment, student, onProgressUpdate }) {
  const [expandedCourse, setExpandedCourse] = useState(null)
  const [expandedLecture, setExpandedLecture] = useState(null)
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [selectedLecture, setSelectedLecture] = useState(null)

  const enrollmentDate = new Date(enrollment.enrollment_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const toggleCourseExpand = () => {
    setExpandedCourse(expandedCourse === enrollment.course_id ? null : enrollment.course_id)
    setExpandedLecture(null)
  }

  const toggleLectureExpand = (lectureId) => {
    setExpandedLecture(expandedLecture === lectureId ? null : lectureId)
  }

  const toggleLectureComplete = async (lectureId, currentStatus, e) => {
    e.stopPropagation()
    try {
      const response = await fetch('http://localhost:5006/api/student/lecture/toggle-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          lectureId,
          isCompleted: !currentStatus,
        }),
      })

      const data = await response.json()
      if (data.success) {
        onProgressUpdate()
      }
    } catch (err) {
      console.error('Error toggling lecture:', err)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Course Header */}
      <button
        onClick={toggleCourseExpand}
        className="w-full p-8 text-left flex justify-between items-start group hover:bg-slate-50 transition-colors duration-200"
      >
        <div className="flex-1 pr-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full">
              Active
            </span>
            <span className="text-slate-400 text-sm font-medium">Enrolled on {enrollmentDate}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">{enrollment.title}</h3>
          <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{enrollment.description || 'No description available'}</p>
          
          <div className="flex gap-6 mt-4 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              {enrollment.instructor_username || 'Unknown Instructor'}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {enrollment.lectures?.length || 0} Lectures
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm font-bold mb-2">
              <span className="text-slate-700">Course Progress</span>
              <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                {enrollment.progress_percentage || 0}% Completed
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                style={{ width: `${enrollment.progress_percentage || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className={`w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 transition-all duration-300 group-hover:bg-amber-100 group-hover:text-amber-600 ${expandedCourse === enrollment.course_id ? 'rotate-180 bg-amber-100 text-amber-600' : ''}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Course Details */}
      {expandedCourse === enrollment.course_id && (
        <div className="border-t border-slate-100 bg-slate-50/50">
          {/* Course Info */}
          <div className="p-8 border-b border-slate-100 bg-white">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">About this Course</h4>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{enrollment.description || 'No description available'}</p>
          </div>

          {/* Lectures */}
          <div className="p-8">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">
              Course Content
            </h4>

            {enrollment.lectures && enrollment.lectures.length > 0 ? (
              <div className="space-y-4">
                {enrollment.lectures.map((lecture) => (
                  <div key={lecture.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    {/* Lecture Header */}
                    <div className="w-full p-5 flex justify-between items-center hover:bg-slate-50 transition-colors">
                      <button
                        onClick={() => toggleLectureExpand(lecture.id)}
                        className="flex-1 flex justify-between items-center text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                            lecture.is_completed 
                              ? 'bg-emerald-100 text-emerald-600' 
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            {lecture.is_completed ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                              lecture.lecture_number
                            )}
                          </div>
                          <div>
                            <p className={`font-bold ${lecture.is_completed ? 'text-emerald-900' : 'text-slate-900'}`}>
                              {lecture.title}
                            </p>
                            {lecture.video_path && (
                              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                Video Content
                              </p>
                            )}
                          </div>
                        </div>
                        <svg
                          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                            expandedLecture === lecture.id ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={(e) => toggleLectureComplete(lecture.id, lecture.is_completed, e)}
                        className={`ml-4 p-2 rounded-xl transition-all duration-200 border ${
                          lecture.is_completed 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' 
                            : 'bg-white text-slate-400 border-slate-200 hover:border-emerald-500 hover:text-emerald-500'
                        }`}
                        title={lecture.is_completed ? "Mark as incomplete" : "Mark as complete"}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>

                    {/* Lecture Details */}
                    {expandedLecture === lecture.id && (
                      <div className="border-t border-slate-100 p-6 bg-slate-50/30 space-y-6">
                        {/* Video Player */}
                        {lecture.video_path && (
                          <div className="rounded-xl overflow-hidden shadow-lg bg-black">
                            <video
                              controls
                              className="w-full aspect-video"
                              src={`http://localhost:5006${lecture.video_path}`}
                            >
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        )}

                        {/* Materials */}
                        {lecture.materials && lecture.materials.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                              Study Materials
                            </p>
                            <div className="grid gap-3 sm:grid-cols-2">
                              {lecture.materials.map((material) => (
                                <a
                                  key={material.id}
                                  href={`http://localhost:5006${material.file_path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-amber-400 hover:shadow-md transition-all duration-200 group"
                                >
                                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center mr-3 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-900 truncate group-hover:text-amber-600 transition-colors">
                                      {material.file_name}
                                    </p>
                                    <p className="text-xs text-slate-500">{material.material_type}</p>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {!lecture.video_path && (!lecture.materials || lecture.materials.length === 0) && (
                          <p className="text-slate-500 italic text-center py-4">No content available for this lecture</p>
                        )}

                        {/* Quiz Button */}
                        <div className="pt-4 border-t border-slate-200">
                          <button
                            onClick={() => {
                              setSelectedLecture(lecture)
                              setShowQuizModal(true)
                            }}
                            className="w-full bg-slate-900 hover:bg-amber-500 text-white py-4 rounded-xl transition-all duration-300 font-bold flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 hover:shadow-amber-500/30"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Take Lecture Quiz
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500">No lectures added to this course yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Quiz Modal */}
      {showQuizModal && selectedLecture && (
        <QuizModal
          lecture={selectedLecture}
          courseId={enrollment.course_id}
          onClose={() => {
            setShowQuizModal(false)
            setSelectedLecture(null)
          }}
        />
      )}
    </div>
  )
}
