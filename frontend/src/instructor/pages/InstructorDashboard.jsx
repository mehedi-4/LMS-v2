import { useState } from 'react'
import { useInstructorAuth } from '../context/InstructorAuthContext'
import View from './dashboard/View'
import Profile from './dashboard/Profile'
import PaymentSetup from './dashboard/PaymentSetup'
import UploadCourse from './dashboard/UploadCourse'
import Transactions from './dashboard/Transactions'

export default function Dashboard() {
    const { user, logout } = useInstructorAuth()
    const [activeMenu, setActiveMenu] = useState('profile')

    const handleLogout = () => {
        logout()
    }

    const renderContent = () => {
        switch (activeMenu) {
            case 'profile':
                return <Profile user={user} />
            case 'payment':
                return <PaymentSetup user={user} />
            case 'transactions':
                return <Transactions user={user} />
            case 'upload-course':
                return <UploadCourse user={user} />
            case 'view-course':
                return <View user={user} />
            default:
                return <Profile user={user} />
        }
    }

    return (
        <div className="flex h-screen bg-slate-50 font-sans">
            <div className="w-72 bg-slate-900 text-white shadow-2xl flex flex-col">
                <div className="p-8 border-b border-slate-800">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20">
                            👨‍🏫
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">{user?.username}</h2>
                            <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mt-1">Instructor</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <SidebarButton 
                        active={activeMenu === 'profile'} 
                        onClick={() => setActiveMenu('profile')}
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                        label="Profile"
                    />
                    <SidebarButton 
                        active={activeMenu === 'payment'} 
                        onClick={() => setActiveMenu('payment')}
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                        label="Payment Setup"
                    />
                    <SidebarButton 
                        active={activeMenu === 'transactions'} 
                        onClick={() => setActiveMenu('transactions')}
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                        label="Transactions"
                    />
                    <SidebarButton 
                        active={activeMenu === 'upload-course'} 
                        onClick={() => setActiveMenu('upload-course')}
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}
                        label="Upload Course"
                    />
                    <SidebarButton 
                        active={activeMenu === 'view-course'} 
                        onClick={() => setActiveMenu('view-course')}
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                        label="My Courses"
                    />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all duration-200 group"
                    >
                        <svg className="w-5 h-5 mr-3 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-slate-50">
                <div className="p-8 max-w-7xl mx-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}

function SidebarButton({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                active 
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20 font-bold' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'
            }`}
        >
            <span className={`mr-3 transition-colors ${active ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
                {icon}
            </span>
            {label}
            {active && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l-full"></div>
            )}
        </button>
    )
}
