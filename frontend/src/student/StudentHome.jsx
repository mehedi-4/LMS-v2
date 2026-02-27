import { useState } from 'react'
import StudentDashboard from './StudentDashboard'
import { StudentAuthProvider, useStudentAuth } from './StudentAuthContext'

function StudentHomeContent() {
  const { isAuthenticated, loading, error, login, signup } = useStudentAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login')
  const [formError, setFormError] = useState('')

  const toggleMode = (nextMode) => {
    setMode(nextMode)
    setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!username.trim() || !password.trim()) {
      setFormError('Please fill in all fields')
      return
    }

    const action = mode === 'login' ? login : signup
    const result = await action(username.trim(), password.trim())

    if (!result.success) {
      setFormError(result.message || 'Unable to complete the request')
      return
    }

    setUsername('')
    setPassword('')
  }

  if (isAuthenticated) {
    return <StudentDashboard />
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 border border-slate-100">
        <div className="flex justify-center mb-8 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => toggleMode('login')}
            className={`flex-1 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-200 ${
              mode === 'login' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => toggleMode('signup')}
            className={`flex-1 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-200 ${
              mode === 'signup' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-slate-900/20">
            <span className="text-3xl">🎓</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Join LMS Academy'}
          </h1>
          <p className="text-slate-500 mt-2">
            {mode === 'login' ? 'Access your courses and certificates' : 'Start your learning journey today'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-medium"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a password"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-medium"
              disabled={loading}
            />
          </div>

          {(formError || error) && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {formError || error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-xl text-white font-bold shadow-lg transition-all duration-200 flex items-center justify-center gap-2
              ${loading
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
              }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                {mode === 'login' ? 'Sign In' : 'Create Account'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function StudentHome() {
  return (
    <StudentAuthProvider>
      <StudentHomeContent />
    </StudentAuthProvider>
  )
}
