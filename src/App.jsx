import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router'
import { useSelector } from 'react-redux'
import ProtectedRoute from '@/components/ProtectedRoute'
import AppLayout from '@/components/AppLayout'
import { selectDarkMode } from '@/features/preferences/preferencesSlice'
import './App.scss'

const Login = lazy(() => import('@/pages/Login'))
const Register = lazy(() => import('@/pages/Register'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Transactions = lazy(() => import('@/pages/Transactions'))
const Analytics = lazy(() => import('@/pages/Analytics'))
const Settings = lazy(() => import('@/pages/Settings'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function App() {
  const darkMode = useSelector(selectDarkMode)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <Suspense fallback={<div className="app-loading">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App