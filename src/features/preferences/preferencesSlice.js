import { createSlice } from '@reduxjs/toolkit'
import { getUsers } from '@/utils/userStorage'

const storedCurrentUserEmail = localStorage.getItem('currentUserEmail')
const users = getUsers()
const currentUser = users.find((user) => user.email === storedCurrentUserEmail)

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: {
    darkMode: currentUser?.preferences?.darkMode || false,
  },
  reducers: {
    loadPreferences: (state, action) => {
      state.darkMode = action.payload?.darkMode || false
    },
    clearPreferences: (state) => {
      state.darkMode = false
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
    },
  },
})

export const { loadPreferences, clearPreferences, toggleDarkMode } = preferencesSlice.actions
export default preferencesSlice.reducer

export const selectDarkMode = (state) => state.preferences.darkMode