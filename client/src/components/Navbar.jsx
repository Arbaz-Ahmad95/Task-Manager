
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          Task Manager
        </Link>

        <button 
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggle-icon"></span>
          <span className="navbar-toggle-icon"></span>
          <span className="navbar-toggle-icon"></span>
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'navbar-menu-open' : ''}`}>
          {user ? (
            // User is logged in - show navigation links and logout
            <>
              <div className="navbar-nav">
                <Link 
                  to="/tasks" 
                  className="navbar-link"
                  onClick={closeMenu}
                >
                  Tasks
                </Link>
                
                {user.role === 'admin' && (
                  <Link 
                    to="/users" 
                    className="navbar-link"
                    onClick={closeMenu}
                  >
                    Users
                  </Link>
                )}
              </div>

              <div className="navbar-user">
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                  <span className={`user-role user-role-${user.role}`}>
                    {user.role}
                  </span>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="navbar-logout"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            // User is not logged in - show login/register links
            <div className="navbar-nav">
              <Link 
                to="/login" 
                className="navbar-link"
                onClick={closeMenu}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="navbar-link"
                onClick={closeMenu}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar