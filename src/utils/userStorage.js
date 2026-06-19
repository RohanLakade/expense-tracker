import { DEFAULT_CATEGORIES } from '@/constants/categories'

const USERS_KEY = 'users'

export function getUsers() {
  try {
    const stored = localStorage.getItem(USERS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to read users from storage:', error)
    return []
  }
}

export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch (error) {
    console.error('Failed to save users to storage:', error)
  }
}

export function findUserByEmail(email) {
  return getUsers().find((user) => user.email === email)
}

export function createUser({ email, password }) {
  const users = getUsers()

  const newUser = {
    email,
    password,
    categories: DEFAULT_CATEGORIES,
    transactions: [],
    preferences: { darkMode: false },
  }

  users.push(newUser)
  saveUsers(users)

  return newUser
}

export function updateUser(email, updates) {
  const users = getUsers()
  const updatedUsers = users.map((user) =>
    user.email === email ? { ...user, ...updates } : user
  )
  saveUsers(updatedUsers)
}