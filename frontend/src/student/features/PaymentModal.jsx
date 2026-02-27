export default function PaymentModal({ form, onChange, onClose, onSubmit, status, loading }) {
  return (
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 transform transition-all">
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-amber-400">💳</span> Payment Setup
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8">
          <p className="text-slate-500 mb-6">
            Please enter your bank account details to enable transactions.
          </p>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="student-bankAccNo" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                Account Number
              </label>
              <input
                id="student-bankAccNo"
                type="text"
                value={form.bankAccNo}
                onChange={(e) => onChange((prev) => ({ ...prev, bankAccNo: e.target.value }))}
                className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-medium"
                placeholder="Enter bank account number"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="student-bankSecretKey" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
                Secret Key
              </label>
              <input
                id="student-bankSecretKey"
                type="password"
                value={form.bankSecretKey}
                onChange={(e) => onChange((prev) => ({ ...prev, bankSecretKey: e.target.value }))}
                className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-medium"
                placeholder="Enter secret key"
                disabled={loading}
              />
            </div>

            {status.message && (
              <div
                className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 ${
                  status.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-100 text-emerald-600'
                    : 'bg-red-50 border border-red-100 text-red-600'
                }`}
              >
                {status.type === 'success' ? (
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                )}
                {status.message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-xl text-white font-bold shadow-lg transition-all duration-200 flex items-center justify-center gap-2
                ${loading
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  Save Payment Details
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}



