import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi'
import { logout } from '@/features/auth/authSlice'
import { clearTransactions } from '@/features/transactions/transactionsSlice'
import { clearCategories } from '@/features/categories/categoriesSlice'
import { clearPreferences, toggleDarkMode, selectDarkMode } from '@/features/preferences/preferencesSlice'
import './Navbar.scss'

function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const darkMode = useSelector(selectDarkMode)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearTransactions())
    dispatch(clearCategories())
    dispatch(clearPreferences())
    navigate('/')
  }

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <nav className="navbar">
      <div className="navbar__top">
        <span className="navbar__brand">Expense Tracker</span>
        <button
          className="navbar__menu-toggle"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <div className={`navbar__menu ${isMenuOpen ? 'navbar__menu--open' : ''}`}>
        <div className="navbar__links">
          <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
          <Link to="/transactions" onClick={closeMenu}>Transactions</Link>
          <Link to="/analytics" onClick={closeMenu}>Analytics</Link>
          <Link to="/settings" onClick={closeMenu}>Settings</Link>
        </div>

        <div className="navbar__actions">
          <button className="navbar__theme-toggle" onClick={() => dispatch(toggleDarkMode())}>
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
          <button className="navbar__logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar