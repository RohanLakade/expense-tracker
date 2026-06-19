import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTransaction, editTransaction } from '@/features/transactions/transactionsSlice'
import { selectCategories } from '@/features/categories/categoriesSlice'
import './TransactionForm.scss'

function TransactionForm({ transaction, onClose }) {
  const dispatch = useDispatch()
  const categories = useSelector(selectCategories)
  const isEditing = Boolean(transaction)

  const [type, setType] = useState(transaction?.type || 'expense')
  const [amount, setAmount] = useState(transaction?.amount || '')
  const [category, setCategory] = useState(transaction?.category || categories[0] || '')
  const [description, setDescription] = useState(transaction?.description || '')
  const [date, setDate] = useState(transaction?.date || new Date().toISOString().slice(0, 10))

  const handleSubmit = (e) => {
    e.preventDefault()

    const payload = {
      id: isEditing ? transaction.id : crypto.randomUUID(),
      type,
      amount: Number(amount),
      category,
      description,
      date,
    }

    if (isEditing) {
      dispatch(editTransaction(payload))
    } else {
      dispatch(addTransaction(payload))
    }

    onClose()
  }

  return (
    <div className="transaction-form-overlay">
      <div className="transaction-form">
        <h2>{isEditing ? 'Edit Transaction' : 'Add Transaction'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Type
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          <label>
            Amount
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </label>

          <label>
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <label>
            Description
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <label>
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>

          <div className="transaction-form__actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">{isEditing ? 'Save Changes' : 'Add Transaction'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransactionForm