import { useState, useEffect } from 'react'

export default function Transactions({ user, endpoint, accountNo }) {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [resolvedAccountNo, setResolvedAccountNo] = useState(accountNo || '')

  const transactionsEndpoint = endpoint || (user?.id ? `http://localhost:5006/api/instructor/${user.id}/transactions` : '')

  useEffect(() => {
    if (transactionsEndpoint) {
      fetchTransactions()
    }
  }, [transactionsEndpoint])

  const fetchTransactions = async () => {
    if (!transactionsEndpoint) {
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await fetch(transactionsEndpoint)
      const data = await response.json()

      if (data.success) {
        setBalance(data.balance)
        setTransactions(data.transactions)
        setResolvedAccountNo(data.accountNo || accountNo || user?.bank_acc_no || '')
      } else {
        setError(data.message || 'Failed to fetch transactions')
      }
    } catch (err) {
      setError('Error fetching transactions: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-amber-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Transactions</h2>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-sm font-medium flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-slate-100">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-amber-500"></div>
          </div>
          <p className="text-slate-500 mt-4 font-medium">Loading transactions...</p>
        </div>
      ) : (
        <>
          <div className="bg-slate-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Account Balance</p>
              <p className="text-5xl font-bold text-white tracking-tight">${parseFloat(balance || 0).toFixed(2)}</p>
              {resolvedAccountNo && (
                <div className="mt-6 flex items-center gap-2 text-slate-400 bg-slate-800/50 w-fit px-4 py-2 rounded-lg border border-slate-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  <span className="font-mono">Account: {resolvedAccountNo}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">Transaction History</h2>
            </div>
            {transactions.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                </div>
                <p className="font-medium">No transactions found</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {transactions.map((transaction) => {
                  const isOutgoing = transaction.direction === 'outgoing'
                  
                  return (
                    <div key={transaction.id} className="p-6 hover:bg-slate-50 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isOutgoing ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                            }`}>
                              {isOutgoing ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{transaction.description || 'Transaction'}</p>
                              <p className="text-sm text-slate-500 mt-0.5 font-medium">
                                {isOutgoing ? `To: ${transaction.to_account_no}` : `From: ${transaction.from_account_no || 'LMS'}`}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${isOutgoing ? 'text-red-600' : 'text-green-600'}`}>
                            {isOutgoing ? '-' : '+'}${parseFloat(transaction.amount).toFixed(2)}
                          </p>
                          <p className="text-xs text-slate-400 font-medium mt-1">
                            {formatDate(transaction.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

