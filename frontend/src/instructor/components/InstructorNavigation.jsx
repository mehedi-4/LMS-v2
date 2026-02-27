import { Link } from 'react-router-dom'

export default function InstructorNavigation() {
  return (
    <nav className="bg-slate-900 shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-slate-900 font-bold text-xl">
              C
            </div>
            <Link to="/" className="text-white text-2xl font-bold hover:text-amber-400 transition-colors">
              CS Aacademy
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
