import { useEffect, useState } from 'react'

export default function OverviewSection({ student, onSetupClick, onEnrollClick }) {
  const [courses, setCourses] = useState([])
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCourses()
    if (student?.id) {
      fetchEnrollments()
    }
  }, [student?.id])

  const fetchCourses = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('http://localhost:5006/api/courses')
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

  const fetchEnrollments = async () => {
    try {
      const response = await fetch(`http://localhost:5006/api/student/${student.id}/enrollments`)
      const data = await response.json()

      if (data.success) {
        const enrolledIds = data.enrollments.map((e) => e.course_id)
        setEnrolledCourseIds(enrolledIds)
      }
    } catch (err) {
      console.error('Error fetching enrollments:', err)
    }
  }

  const handleEnrollClick = (course) => {
    if (!student?.id) {
      setError('Please login to enroll in courses')
      return
    }
    if (!student?.paymentSetup) {
      setError('Please set up your payment information first')
      onSetupClick()
      return
    }
    onEnrollClick(course)
  }

  const availableCourses = courses.filter((course) => !enrolledCourseIds.includes(course.id))

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, {student?.username}</h1>
        <p className="text-slate-500 mt-2 text-lg">Explore our premium courses and expand your knowledge.</p>
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
          <p className="text-slate-500 mt-4 font-medium">Loading courses...</p>
        </div>
      ) : availableCourses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <p className="text-slate-500 text-lg">No new courses available. Check your enrolled courses tab.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availableCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnroll={() => handleEnrollClick(course)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CourseCard({ course, onEnroll }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="p-8 flex flex-col h-full">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">{course.title}</h3>
          <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
            {course.description || 'No description available'}
          </p>
        </div>
        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-3xl font-bold text-slate-900">${parseFloat(course.price || 0).toFixed(2)}</p>
              {course.instructor_username && (
                <p className="text-xs text-slate-400 mt-1 font-medium uppercase tracking-wide">By {course.instructor_username}</p>
              )}
            </div>
          </div>
          <button
            onClick={onEnroll}
            className="w-full py-3 px-6 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 bg-slate-900 text-white hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/30"
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  )
}

