import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCategories,
  addCategory,
  editCategory,
  deleteCategory,
} from '@/features/categories/categoriesSlice'
import { renameCategoryInTransactions } from '@/features/transactions/transactionsSlice'
import { findUserByEmail, updateUser } from '@/utils/userStorage'
import './Settings.scss'

function Settings() {
  const dispatch = useDispatch()
  const categories = useSelector(selectCategories)
  const currentUserEmail = useSelector((state) => state.auth.currentUserEmail)

  const [newCategory, setNewCategory] = useState('')
  const [editingCategory, setEditingCategory] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [categoryError, setCategoryError] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  const handleAddCategory = (e) => {
    e.preventDefault()

    const trimmed = newCategory.trim()
    if (!trimmed) return

    if (categories.includes(trimmed)) {
      setCategoryError('That category already exists')
      return
    }

    dispatch(addCategory(trimmed))
    setNewCategory('')
    setCategoryError('')
  }

  const startEditing = (category) => {
    setEditingCategory(category)
    setEditValue(category)
  }

  const handleEditSave = () => {
    const trimmed = editValue.trim()

    if (!trimmed || trimmed === editingCategory) {
      setEditingCategory(null)
      return
    }

    if (categories.includes(trimmed)) {
      setCategoryError('That category already exists')
      return
    }

    dispatch(editCategory({ oldName: editingCategory, newName: trimmed }))
    dispatch(renameCategoryInTransactions({ oldName: editingCategory, newName: trimmed }))
    setEditingCategory(null)
    setCategoryError('')
  }

  const handleDeleteCategory = (category) => {
    dispatch(deleteCategory(category))
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    setPasswordSuccess('')

    const user = findUserByEmail(currentUserEmail)

    if (!user || user.password !== currentPassword) {
      setPasswordError('Current password is incorrect')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    updateUser(currentUserEmail, { password: newPassword })
    setPasswordError('')
    setPasswordSuccess('Password updated successfully')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="settings">
      <h1>Settings</h1>

      <div className="settings__card">
        <h2>Categories</h2>

        <form className="settings__add-form" onSubmit={handleAddCategory}>
          <input
            type="text"
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>

        {categoryError && <p className="settings__error">{categoryError}</p>}

        <ul className="settings__category-list">
          {categories.map((category) => (
            <li key={category}>
              {editingCategory === category ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                  <button onClick={handleEditSave}>Save</button>
                  <button onClick={() => setEditingCategory(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span>{category}</span>
                  <button onClick={() => startEditing(category)}>Edit</button>
                  <button onClick={() => handleDeleteCategory(category)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="settings__card">
        <h2>Change Password</h2>

        <form className="settings__password-form" onSubmit={handlePasswordChange}>
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {passwordError && <p className="settings__error">{passwordError}</p>}
          {passwordSuccess && <p className="settings__success">{passwordSuccess}</p>}
          <button type="submit">Update Password</button>
        </form>
      </div>
    </div>
  )
}

export default Settings