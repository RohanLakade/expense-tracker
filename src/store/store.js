import { configureStore } from '@reduxjs/toolkit'
import transactionsReducer from '@/features/transactions/transactionsSlice'
import authReducer from '@/features/auth/authSlice'
import categoriesReducer from '@/features/categories/categoriesSlice'
import preferencesReducer from '@/features/preferences/preferencesSlice'
import { getUsers, saveUsers } from '@/utils/userStorage'

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    auth: authReducer,
    categories: categoriesReducer,
    preferences: preferencesReducer,
  },
})

store.subscribe(() => {
  const state = store.getState()
  const currentUserEmail = state.auth.currentUserEmail

  if (!currentUserEmail) return

  const users = getUsers()
  const updatedUsers = users.map((user) =>
    user.email === currentUserEmail
      ? {
          ...user,
          transactions: state.transactions.items,
          categories: state.categories.items,
          preferences: { darkMode: state.preferences.darkMode },
        }
      : user
  )

  saveUsers(updatedUsers)
})