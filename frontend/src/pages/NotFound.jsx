import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-slate-700/20 rounded-full blur-3xl"></div>
      </div>

      <div className="text-center relative z-10">
        <h1 className="text-9xl font-bold text-white mb-4 opacity-10">404</h1>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
          <h2 className="text-3xl font-bold text-white mb-2">Page Not Found</h2>
          <p className="text-slate-400 mb-8">The page you are looking for doesn't exist or has been moved.</p>
          <Link
            to="/"
            className="bg-amber-500 text-slate-900 px-8 py-3 rounded-xl hover:bg-amber-400 transition-all font-bold shadow-lg shadow-amber-500/20 inline-flex items-center gap-2 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  )
}
