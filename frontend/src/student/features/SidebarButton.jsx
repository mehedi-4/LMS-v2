export default function SidebarButton({ label, iconPath, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive 
          ? 'bg-slate-800 text-white shadow-lg shadow-slate-900/50 border-l-4 border-amber-400' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <span className="flex items-center">
        <svg 
          className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-white'}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d={iconPath} />
        </svg>
        <span className="font-medium">{label}</span>
      </span>
    </button>
  )
}
