import { useSelector } from 'react-redux'
import {
  selectTotalIncome,
  selectTotalExpense,
  selectBalance,
} from '@/features/transactions/transactionsSlice'
import './Dashboard.scss'

function Dashboard() {
  const totalIncome = useSelector(selectTotalIncome)
  const totalExpense = useSelector(selectTotalExpense)
  const balance = useSelector(selectBalance)

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard__summary">
        <div className="summary-card">
          <p className="summary-card__label">Total Balance</p>
          <p className="summary-card__value">₹{balance}</p>
        </div>
        <div className="summary-card">
          <p className="summary-card__label">Total Income</p>
          <p className="summary-card__value">₹{totalIncome}</p>
        </div>
        <div className="summary-card">
          <p className="summary-card__label">Total Expense</p>
          <p className="summary-card__value">₹{totalExpense}</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard