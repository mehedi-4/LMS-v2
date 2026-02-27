import { useEffect, useState } from 'react'
import { useStudentAuth } from '../StudentAuthContext'

export default function QuizModal({ lecture, courseId, onClose }) {
  const { student } = useStudentAuth()
  const [quizzes, setQuizzes] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchQuizzes()
  }, [lecture.id])

  const fetchQuizzes = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`http://localhost:5006/api/lecture/${lecture.id}/quizzes`)
      const data = await response.json()

      if (data.success) {
        setQuizzes(data.quizzes)
        const initialAnswers = {}
        data.quizzes.forEach((quiz, idx) => {
          initialAnswers[idx] = null
        })
        setAnswers(initialAnswers)
      } else {
        setError(data.message || 'Failed to fetch quizzes')
      }
    } catch (err) {
      setError('Error fetching quizzes: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (quizIndex, answer) => {
    setAnswers(prev => ({ ...prev, [quizIndex]: answer }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const answersArray = Object.values(answers)
      const response = await fetch('http://localhost:5006/api/student/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          lectureId: lecture.id,
          answers: answersArray,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.message || 'Failed to submit quiz')
      }
    } catch (err) {
      setError('Error submitting quiz: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 relative border border-slate-100 overflow-hidden">
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex justify-between items-center z-10">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-amber-400">📝</span> Quiz: {lecture.title}
            </h3>
            <p className="text-slate-400 text-sm mt-1 font-medium">Lecture {lecture.lecture_number}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-3xl leading-none"
            aria-label="Close quiz"
          >
            ×
          </button>
        </div>

        <div className="p-8 bg-slate-50/50 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-medium">Loading quiz questions...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-xl text-sm font-medium flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          ) : result ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-50 text-emerald-600 mb-4">
                  <span className="text-4xl font-bold">{result.lectureScore.percentage.toFixed(0)}%</span>
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-2">Quiz Completed!</h4>
                <p className="text-slate-500 text-lg">
                  You answered <span className="font-bold text-slate-900">{result.lectureScore.correct}</span> out of <span className="font-bold text-slate-900">{result.lectureScore.total}</span> questions correctly.
                </p>
                
                <div className="mt-8 pt-8 border-t border-slate-100 grid gap-6 md:grid-cols-2 text-left">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Course Progress</p>
                    <p className="text-3xl font-bold text-slate-900">
                      {result.courseScore.percentage.toFixed(1)}%
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      Total correct answers across all quizzes
                    </p>
                  </div>
                  
                  {result.courseProgress && (
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Lectures Completed</p>
                      <p className="text-3xl font-bold text-slate-900">
                        {result.courseProgress.completedLectures} <span className="text-lg text-slate-400 font-medium">/ {result.courseProgress.totalLectures}</span>
                      </p>
                      <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                        <div 
                          className="bg-slate-900 h-full rounded-full transition-all duration-500"
                          style={{ width: `${(result.courseProgress.completedLectures / result.courseProgress.totalLectures) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {!result.courseProgress?.allCompleted && (
                  <div className="mt-6 bg-blue-50 text-blue-700 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-3 text-left">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m-1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p>Complete all lecture quizzes with an 80% total score to earn your certificate.</p>
                  </div>
                )}

                {result.courseProgress?.allCompleted && result.courseScore.percentage < 80 && (
                  <div className="mt-6 bg-amber-50 text-amber-700 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-3 text-left">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <p>You've completed all lectures, but need an 80% total score for certification. You can retake quizzes to improve your score.</p>
                  </div>
                )}

                {result.certificateEarned && (
                  <div className="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-6 text-center animate-bounce-in">
                    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                      🏆
                    </div>
                    <h5 className="text-xl font-bold text-amber-900 mb-2">Certificate Earned!</h5>
                    <p className="text-amber-800 mb-4">
                      Congratulations! You've successfully completed the course requirements.
                    </p>
                    <button
                      onClick={onClose}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-amber-500/20 transition-all"
                    >
                      View Certificate
                    </button>
                  </div>
                )}
              </div>
              
              <button
                onClick={onClose}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl transition-all font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Close Results
              </button>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📝</div>
              <p className="text-slate-500 font-medium">No quizzes available for this lecture yet.</p>
              <button
                onClick={onClose}
                className="mt-6 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg transition font-bold"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {quizzes.map((quiz, idx) => (
                <div key={quiz.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-4 mb-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </span>
                    <p className="font-bold text-slate-900 text-lg pt-0.5">
                      {quiz.question}
                    </p>
                  </div>
                  
                  <div className="space-y-3 pl-12">
                    {['A', 'B', 'C', 'D'].map((option) => (
                      <label
                        key={option}
                        className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 group
                          ${answers[idx] === option 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                            : 'bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                          }`}
                      >
                        <input
                          type="radio"
                          name={`quiz-${idx}`}
                          value={option}
                          checked={answers[idx] === option}
                          onChange={() => handleAnswerChange(idx, option)}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors
                          ${answers[idx] === option ? 'border-white' : 'border-slate-300 group-hover:border-slate-400'}`}>
                          {answers[idx] === option && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                        </div>
                        <span className={`font-medium ${answers[idx] === option ? 'text-white' : 'text-slate-700'}`}>
                          <span className={`font-bold mr-2 ${answers[idx] === option ? 'text-amber-400' : 'text-slate-900'}`}>{option}.</span> 
                          {quiz[`option_${option.toLowerCase()}`]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {Object.values(answers).some(a => a === null) && (
                <div className="bg-amber-50 text-amber-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  Please answer all questions before submitting.
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-white border border-slate-200 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-4 rounded-xl text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2
                    ${submitting || Object.values(answers).some(a => a === null)
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-slate-900 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5'
                    }`}
                  disabled={submitting || Object.values(answers).some(a => a === null)}
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Quiz
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
