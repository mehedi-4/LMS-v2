import { useState } from 'react'
import Transactions from '../../instructor/pages/dashboard/Transactions'

export default function AdminDashboard() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    setError('')

    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true)
      setUsername('')
      setPassword('')
      return
    }

    setError('Invalid username or password')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-slate-700/20 rounded-full blur-3xl"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 border border-slate-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-slate-900/20">
              <span className="text-3xl">🛠️</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Portal</h1>
            <p className="text-slate-500 mt-2">Sign in to view LMS transactions</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="admin-username" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                Username
              </label>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-medium"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-medium"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl text-white font-bold shadow-lg transition-all duration-200 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <div className="w-72 bg-slate-900 text-white shadow-2xl flex flex-col">
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20">
              🛠️
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Admin</h2>
              <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mt-1">LMS Account</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            className="w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden bg-amber-500 text-white shadow-lg shadow-amber-500/20 font-bold"
            type="button"
          >
            <span className="mr-3 text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </span>
            Transactions
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l-full"></div>
          </button>
        </nav>
      </div>

      <div className="flex-1 overflow-auto bg-slate-50">
        <div className="p-8 max-w-7xl mx-auto">
          <Transactions endpoint="http://localhost:5006/api/admin/transactions" accountNo="9999999999999999" />
        </div>
      </div>
    </div>
  )
}
