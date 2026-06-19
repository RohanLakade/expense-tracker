import { createSlice } from '@reduxjs/toolkit'

const storedCurrentUserEmail = localStorage.getItem('currentUserEmail')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUserEmail: storedCurrentUserEmail || null,
  },
  reducers: {
    login: (state, action) => {
      state.currentUserEmail = action.payload
      localStorage.setItem('currentUserEmail', action.payload)
    },
    logout: (state) => {
      state.currentUserEmail = null
      localStorage.removeItem('currentUserEmail')
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer