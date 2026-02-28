export default function PaymentSection({ student, onSetupClick }) {
  const hasPayment = Boolean(student?.paymentSetup)
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payment Settings</h1>
        <p className="text-slate-500 mt-2 text-lg">Manage your banking details for transactions.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${hasPayment ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              {hasPayment ? '✓' : '⚠️'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Bank Account Status</h2>
              <p className="text-slate-500 text-sm">
                {hasPayment ? 'Your account is linked and active.' : 'Action required: Link your bank account.'}
              </p>
            </div>
          </div>

          {hasPayment ? (
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <span className="text-slate-500 font-medium uppercase tracking-wider text-xs">Account Number</span>
                <span className="font-mono text-lg font-bold text-slate-900">{student.bankAccNo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium uppercase tracking-wider text-xs">Secret Key</span>
                <span className="font-mono text-lg font-bold text-slate-900">{student.bankSecretKey}</span>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 text-amber-800 flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <p className="font-medium">You haven't set up your payment details yet. You'll need to link a bank account to make purchases or receive refunds.</p>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={onSetupClick}
              className="w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-200 bg-slate-900 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              {hasPayment ? 'Update Payment Details' : 'Setup Payment Method'}
            </button>
          </div>
        </div>
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center">
            Your banking information is encrypted and stored securely. We never share your details.
          </p>
        </div>
      </div>
    </div>
  )
}
