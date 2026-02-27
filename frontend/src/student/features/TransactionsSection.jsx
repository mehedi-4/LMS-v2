import { useEffect, useState } from 'react'

export default function TransactionsSection({ student }) {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (student?.id) {
      fetchTransactions()
    }
  }, [student?.id])

  const fetchTransactions = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`http://localhost:5006/api/student/${student.id}/transactions`)
      const data = await response.json()

      if (data.success) {
        setBalance(data.balance)
        setTransactions(data.transactions)
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
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Transactions</h1>
        <p className="text-slate-500 mt-2 text-lg">Track your financial activity and balance.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-900"></div>
          </div>
          <p className="text-slate-500 mt-4 font-medium">Loading transactions...</p>
        </div>
      ) : (
        <>
          {/* Balance Card */}
          <div className="bg-slate-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="relative z-10">
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Current Balance</p>
              <p className="text-5xl font-bold tracking-tight">${parseFloat(balance || 0).toFixed(2)}</p>
              {student?.bankAccNo && (
                <div className="mt-6 flex items-center gap-2 text-slate-400 bg-white/5 w-fit px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  <span className="font-mono text-sm">{student.bankAccNo}</span>
                </div>
              )}
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Transaction History</h2>
            </div>
            {transactions.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">💸</div>
                <p>No transactions found</p>
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
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isOutgoing ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOutgoing ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                              </svg>
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{transaction.description || 'Transaction'}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                                  {isOutgoing ? 'Debit' : 'Credit'}
                                </span>
                                <span className="text-sm text-slate-500">
                                  {isOutgoing ? `To: ${transaction.to_account_no}` : `From: ${transaction.from_account_no || 'LMS'}`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${isOutgoing ? 'text-slate-900' : 'text-emerald-600'}`}>
                            {isOutgoing ? '-' : '+'}${parseFloat(transaction.amount).toFixed(2)}
                          </p>
                          <p className="text-xs text-slate-400 mt-1 font-medium">{formatDate(transaction.created_at)}</p>
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
