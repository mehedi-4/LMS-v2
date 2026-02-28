export default function Profile({ user }) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="flex items-center mb-10">
          <div className="w-24 h-24 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/20">
            <span className="text-5xl font-bold text-amber-400">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-8">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Welcome, {user?.username}!</h1>
            <p className="text-slate-500 text-lg mt-2 font-medium">Instructor Dashboard</p>
          </div>
        </div>

        <div className="mt-8 p-8 bg-slate-900 rounded-2xl shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-amber-400"></span> Getting Started
          </h3>
          <ul className="space-y-4 relative z-10">
            <li className="flex items-start group">
              <span className="flex-shrink-0 w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-amber-400 font-bold mr-4 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">1</span>
              <span className="text-slate-300 pt-1">Set up your payment information in the <span className="text-white font-semibold">Payment Setup</span> section</span>
            </li>
            <li className="flex items-start group">
              <span className="flex-shrink-0 w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-amber-400 font-bold mr-4 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">2</span>
              <span className="text-slate-300 pt-1">Create your first course using the <span className="text-white font-semibold">Upload Course</span> section</span>
            </li>
            <li className="flex items-start group">
              <span className="flex-shrink-0 w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-amber-400 font-bold mr-4 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">3</span>
              <span className="text-slate-300 pt-1">Add video lectures and course materials to your courses</span>
            </li>
            <li className="flex items-start group">
              <span className="flex-shrink-0 w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-amber-400 font-bold mr-4 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">4</span>
              <span className="text-slate-300 pt-1">Students will be able to enroll and access your courses</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
