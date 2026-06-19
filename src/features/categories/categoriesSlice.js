import { createSlice } from '@reduxjs/toolkit'
import { getUsers } from '@/utils/userStorage'

const storedCurrentUserEmail = localStorage.getItem('currentUserEmail')
const users = getUsers()
const currentUser = users.find((user) => user.email === storedCurrentUserEmail)

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    items: currentUser ? currentUser.categories : [],
  },
  reducers: {
    loadCategories: (state, action) => {
      state.items = action.payload
    },
    clearCategories: (state) => {
      state.items = []
    },
    addCategory: (state, action) => {
      state.items.push(action.payload)
    },
    editCategory: (state, action) => {
      const { oldName, newName } = action.payload
      const index = state.items.indexOf(oldName)
      if (index !== -1) {
        state.items[index] = newName
      }
    },
    deleteCategory: (state, action) => {
      state.items = state.items.filter((category) => category !== action.payload)
    },
  },
})

export const {
  loadCategories,
  clearCategories,
  addCategory,
  editCategory,
  deleteCategory,
} = categoriesSlice.actions
export default categoriesSlice.reducer

export const selectCategories = (state) => state.categories.items