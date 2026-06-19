import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  selectTransactions,
  selectTotalIncome,
  selectTotalExpense,
} from '@/features/transactions/transactionsSlice'
import './Analytics.scss'

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#d97706', '#7c3aed', '#0891b2', '#db2777', '#65a30d']

function formatMonth(month) {
  return new Date(`${month}-01`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function Analytics() {
  const transactions = useSelector(selectTransactions)
  const totalIncome = useSelector(selectTotalIncome)
  const totalExpense = useSelector(selectTotalExpense)

  const expensesByCategory = useMemo(() => {
    const totals = {}

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        totals[t.category] = (totals[t.category] || 0) + t.amount
      })

    return Object.entries(totals).map(([category, amount]) => ({ category, amount }))
  }, [transactions])

  const incomeVsExpense = [
    { name: 'Income', amount: totalIncome },
    { name: 'Expense', amount: totalExpense },
  ]

  const monthlyTrend = useMemo(() => {
    const totals = {}

    transactions.forEach((t) => {
      const month = t.date.slice(0, 7)

      if (!totals[month]) {
        totals[month] = { month, income: 0, expense: 0 }
      }

      totals[month][t.type] += t.amount
    })

    return Object.values(totals)
      .map((entry) => ({ ...entry, savings: entry.income - entry.expense }))
      .sort((a, b) => a.month.localeCompare(b.month))
  }, [transactions])

  return (
    <div className="analytics">
      <h1>Analytics</h1>

      <div className="analytics__grid">
        <div className="analytics__card">
          <h2>Expenses by Category</h2>
          {expensesByCategory.length === 0 ? (
            <p>No expenses yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  dataKey="amount"
                  nameKey="category"
                  outerRadius={90}
                  label
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="analytics__card">
          <h2>Income vs Expense</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={incomeVsExpense}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="analytics__card analytics__card--wide">
        <h2>Monthly Trend</h2>
        {monthlyTrend.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyTrend} barCategoryGap="25%" barGap={2}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tickFormatter={formatMonth} />
              <YAxis />
              <Tooltip labelFormatter={formatMonth} />
              <Legend />
              <Bar dataKey="income" fill="#16a34a" name="Income" />
              <Bar dataKey="expense" fill="#dc2626" name="Expense" />
              <Bar dataKey="savings" fill="#2563eb" name="Savings" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

export default Analytics