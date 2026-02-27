import { useEffect, useState } from 'react'

export default function CertificationsSection({ student, onGoToCourse }) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloadingCert, setDownloadingCert] = useState(null)

  useEffect(() => {
    if (student?.id) {
      fetchScores()
    }
  }, [student?.id])

  const fetchScores = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`http://localhost:5006/api/student/${student.id}/scores`)
      const data = await response.json()

      if (data.success) {
        const certifiedCourses = data.courses.filter(c => Number(c.percentage_score) >= 80)
        setCourses(certifiedCourses)
      } else {
        setError(data.message || 'Failed to fetch certifications')
      }
    } catch (err) {
      setError('Error fetching certifications: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const downloadCertificate = async (course) => {
    setDownloadingCert(course.course_id)
    try {
      const response = await fetch('http://localhost:5006/api/student/certificate/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          studentName: student.username,
          courseId: course.course_id,
          courseName: course.title,
          percentage: course.percentage_score,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to download certificate')
      }

      const html = await response.text()

      const printWindow = window.open('', '_blank')
      printWindow.document.write(html)
      printWindow.document.close()
    } catch (err) {
      alert('Failed to download certificate: ' + err.message)
    } finally {
      setDownloadingCert(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Certifications</h1>
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
          <p className="text-slate-500 mt-4 font-medium">Loading certifications...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎓</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Certificates Yet</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">Complete courses with a score of 80% or higher to earn your professional certifications.</p>
          <button
            onClick={onGoToCourse}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {courses.map((course) => (
            <div key={course.course_id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl border border-white/10">
                    🎓
                  </div>
                  <div>
                    <h3 className="text-lg font-bold leading-tight">{course.title}</h3>
                    <p className="text-slate-400 text-xs uppercase tracking-wider mt-1">Certificate of Completion</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Score Achieved</p>
                    <p className="text-4xl font-bold text-slate-900">
                      {Number(course.percentage_score).toFixed(1)}%
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      Total correct answers across all quizzes
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Issued On</p>
                    <p className="text-slate-700 font-medium">
                      {new Date(course.certificate_issued_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 flex gap-3 items-start">
                  <div className="text-amber-500 mt-0.5">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                  </div>
                  <p className="text-amber-900 text-sm font-medium">
                    Verified credential from LMS Academy
                  </p>
                </div>

                <button
                  onClick={() => downloadCertificate(course)}
                  disabled={downloadingCert === course.course_id}
                  className="w-full bg-white border-2 border-slate-200 hover:border-slate-900 text-slate-700 hover:text-slate-900 py-3 px-4 rounded-xl transition-all duration-300 font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group-hover:bg-slate-50"
                >
                  {downloadingCert === course.course_id ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-400 border-t-slate-900"></div>
                      <span>Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l3-3m-3 3l-3-3m2-8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Download Certificate</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
