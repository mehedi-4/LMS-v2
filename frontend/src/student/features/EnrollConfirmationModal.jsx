import { useState } from 'react'

export default function EnrollConfirmationModal({ course, student, onClose, onConfirm }) {
  const [enrolling, setEnrolling] = useState(false)
  const [error, setError] = useState('')

  const handleConfirm = async () => {
    if (!student?.id) {
      setError('Please login to enroll in courses')
      return
    }

    setEnrolling(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5006/api/student/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          courseId: course.id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        onConfirm()
        window.location.reload()
      } else {
        setError(data.message || 'Failed to enroll in course')
      }
    } catch (err) {
      setError('Unable to connect to server')
    } finally {
      setEnrolling(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 transform transition-all">
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-amber-400">✦</span> Confirm Enrollment
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6">
          <p className="text-slate-500 mb-6">
            You are about to enroll in this course. Please confirm your purchase.
          </p>

          <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-1">{course.title}</h4>
            {course.instructor_username && (
              <p className="text-sm text-slate-500 mb-4">by {course.instructor_username}</p>
            )}
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="text-slate-500 font-medium uppercase tracking-wider text-xs">Price</span>
              <span className="text-2xl font-bold text-slate-900">
                ${parseFloat(course.price || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium mb-6 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={enrolling}
              className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={enrolling}
              className={`flex-1 px-4 py-3 rounded-xl text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2
                ${enrolling
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5'
                }`}
            >
              {enrolling ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  Confirm Purchase
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
