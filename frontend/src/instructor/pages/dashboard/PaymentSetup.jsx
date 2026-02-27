import { useState } from 'react'
import { useInstructorAuth } from '../../context/InstructorAuthContext'

export default function PaymentSetup() {
  const { user, updateUser } = useInstructorAuth()

  const [bankAccNo, setBankAccNo] = useState('')
  const [bankSecretKey, setBankSecretKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!bankAccNo.trim() || !bankSecretKey.trim()) {
      setMessageType('error')
      setMessage('Please fill in all fields')
      return
    }

    if (!/^\d+$/.test(bankAccNo)) {
      setMessageType('error')
      setMessage('Bank account number must contain only digits')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:5006/api/instructor/payment-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user?.username,
          bankAccNo,
          bankSecretKey,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessageType('success')
        setMessage('Payment setup saved successfully!')

        setBankAccNo('')
        setBankSecretKey('')

        updateUser({
          isSet: data.instructor.payment_setup,
          bank_acc_no: data.instructor.bank_acc_no,
          bank_secret_key: data.instructor.bank_secret_key,
        })
      } else {
        setMessageType('error')
        setMessage(data.message || 'Failed to save payment setup')
      }
    } catch (error) {
      setMessageType('error')
      setMessage('Error connecting to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">

      {user?.isSet && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Payment Info Active</h2>
            </div>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <span className="text-slate-500 font-medium">Account Number</span>
              <span className="text-slate-900 font-bold font-mono text-lg">{user.bank_acc_no}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-500 font-medium">Secret Key</span>
              <span className="text-slate-900 font-bold font-mono text-lg">{user.bank_secret_key}</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {user?.isSet ? 'Update Payment Info' : 'Payment Setup'}
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="bankAccNo" className="block text-sm font-bold text-slate-700 mb-2">
              Bank Account Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <input
                type="text"
                id="bankAccNo"
                value={bankAccNo}
                onChange={(e) => setBankAccNo(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="Enter your account number"
                disabled={loading}
              />
            </div>
            <p className="text-slate-400 text-sm mt-2">Your bank account number where payments will be deposited</p>
          </div>

          <div>
            <label htmlFor="bankSecretKey" className="block text-sm font-bold text-slate-700 mb-2">
              Secret Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
              </div>
              <input
                type="text"
                id="bankSecretKey"
                value={bankSecretKey}
                onChange={(e) => setBankSecretKey(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="Enter your secret key"
                disabled={loading}
              />
            </div>
            <p className="text-slate-400 text-sm mt-2">Your secret key for payment processing</p>
          </div>

          {message && (
            <div className={`p-4 rounded-xl flex items-center gap-3 ${
              messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {messageType === 'success' ? (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
              <p className="font-medium">{message}</p>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Payment Details'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
