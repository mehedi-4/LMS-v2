import { useEffect, useState } from 'react'
import { useStudentAuth } from './StudentAuthContext'
import SidebarButton from './features/SidebarButton'
import OverviewSection from './features/OverviewSection'
import PaymentSection from './features/PaymentSection'
import EnrolledCoursesSection from './features/EnrolledCoursesSection'
import EnrollConfirmationModal from './features/EnrollConfirmationModal'
import TransactionsSection from './features/TransactionsSection'
import CertificationsSection from './features/CertificationsSection'
import PaymentModal from './features/PaymentModal'

export default function StudentDashboard() {
  const { student, logout, updateStudent } = useStudentAuth()
  const [activeMenu, setActiveMenu] = useState('overview')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentForm, setPaymentForm] = useState({ bankAccNo: '', bankSecretKey: '' })
  const [paymentStatus, setPaymentStatus] = useState({ type: '', message: '' })
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [showEnrollModal, setShowEnrollModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)

  useEffect(() => {
    if (student && !student.paymentSetup) {
      setPaymentForm({
        bankAccNo: student.bankAccNo || '',
        bankSecretKey: student.bankSecretKey || '',
      })
      setPaymentStatus({ type: '', message: '' })
      setShowPaymentModal(true)
    }
  }, [student])

  const openPaymentModal = () => {
    setPaymentForm({
      bankAccNo: student?.bankAccNo || '',
      bankSecretKey: student?.bankSecretKey || '',
    })
    setPaymentStatus({ type: '', message: '' })
    setShowPaymentModal(true)
  }

  const closePaymentModal = () => {
    if (paymentLoading) return
    setShowPaymentModal(false)
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    if (!paymentForm.bankAccNo.trim() || !paymentForm.bankSecretKey.trim()) {
      setPaymentStatus({ type: 'error', message: 'Please fill in all fields' })
      return
    }

    setPaymentLoading(true)
    setPaymentStatus({ type: '', message: '' })
    try {
      const response = await fetch('http://localhost:5006/api/student/payment-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: student?.username,
          bankAccNo: paymentForm.bankAccNo.trim(),
          bankSecretKey: paymentForm.bankSecretKey.trim(),
        }),
      })

      const data = await response.json()

      if (!data.success) {
        setPaymentStatus({ type: 'error', message: data.message || 'Failed to save payment info' })
        return
      }

      updateStudent({
        paymentSetup: data.student.paymentSetup,
        bankAccNo: data.student.bankAccNo,
        bankSecretKey: data.student.bankSecretKey,
      })

      setPaymentStatus({ type: 'success', message: 'Payment information saved successfully' })
      setShowPaymentModal(false)
    } catch (err) {
      setPaymentStatus({ type: 'error', message: 'Unable to connect to server' })
    } finally {
      setPaymentLoading(false)
    }
  }

  const renderContent = () => {
    switch (activeMenu) {
      case 'payment':
        return (
          <PaymentSection
            student={student}
            onSetupClick={openPaymentModal}
          />
        )
      case 'enrolled':
        return <EnrolledCoursesSection student={student} />
      case 'certifications':
        return <CertificationsSection student={student} onGoToCourse={() => setActiveMenu('enrolled')} />
      case 'transactions':
        return <TransactionsSection student={student} />
      default:
        return (
          <OverviewSection
            student={student}
            onSetupClick={openPaymentModal}
            onEnrollClick={(course) => {
              setSelectedCourse(course)
              setShowEnrollModal(true)
            }}
          />
        )
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <aside className="w-72 bg-slate-900 text-white shadow-2xl flex flex-col">
        <div className="p-8 border-b border-slate-800">
          <h2 className="text-2xl font-bold tracking-tight text-white">{student?.username}</h2>
          <p className="text-slate-400 text-sm mt-1 font-medium uppercase tracking-wider">Student Portal</p>
        </div>
        <nav className="mt-8 flex-1 px-4 space-y-2">
          <SidebarButton
            label="Overview"
            iconPath="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            isActive={activeMenu === 'overview'}
            onClick={() => setActiveMenu('overview')}
          />
          <SidebarButton
            label="Enrolled Courses"
            iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            isActive={activeMenu === 'enrolled'}
            onClick={() => setActiveMenu('enrolled')}
          />
          <SidebarButton
            label="Certifications"
            iconPath="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            isActive={activeMenu === 'certifications'}
            onClick={() => setActiveMenu('certifications')}
          />
          <SidebarButton
            label="Transactions"
            iconPath="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            isActive={activeMenu === 'transactions'}
            onClick={() => setActiveMenu('transactions')}
          />
          <SidebarButton
            label="Payment Setup"
            iconPath="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 100-4 2 2 0 000 4z"
            isActive={activeMenu === 'payment'}
            onClick={() => setActiveMenu('payment')}
          />
        </nav>
        <div className="p-6 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white py-3 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 group"
          >
            <span>Logout</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-slate-50">
        <div className="p-10 max-w-7xl mx-auto">{renderContent()}</div>
      </main>

      {showPaymentModal && (
        <PaymentModal
          form={paymentForm}
          onChange={setPaymentForm}
          onClose={closePaymentModal}
          onSubmit={handlePaymentSubmit}
          status={paymentStatus}
          loading={paymentLoading}
        />
      )}

      {showEnrollModal && selectedCourse && (
        <EnrollConfirmationModal
          course={selectedCourse}
          student={student}
          onClose={() => {
            setShowEnrollModal(false)
            setSelectedCourse(null)
          }}
          onConfirm={async () => {
            setShowEnrollModal(false)
            setSelectedCourse(null)
          }}
        />
      )}
    </div>
  )
}


