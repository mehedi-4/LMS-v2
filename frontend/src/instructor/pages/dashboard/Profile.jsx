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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Enrollment</h3>
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">Not Set</p>
          </div> */}

          {/* <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Earnings</h3>
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">Not Set</p>
          </div> */}
        </div>

        <div className="mt-8 p-8 bg-slate-900 rounded-2xl shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-amber-400">🚀</span> Getting Started
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
