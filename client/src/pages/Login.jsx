
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Auth.css'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setError('')
      setLoading(true)
      await login(formData.email, formData.password)
      navigate('/tasks')
    } catch (err) {
      setError('Failed to log in: ' + err.message)
    }
    
    setLoading(false)
  }

  // Quick login buttons for testing
  const handleQuickLogin = (email, password) => {
    setFormData({ email, password })
  }
  
  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login to Task Manager</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <button disabled={loading} type="submit" className="btn btn-primary btn-full">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Quick Login Buttons for Testing */}
        <div className="quick-login-section">
          <h3>Quick Test Logins:</h3>
          <div className="quick-login-buttons">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@example.com', 'password')}
              className="btn btn-admin"
            >
              Login as Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('member@example.com', 'password')}
              className="btn btn-member"
            >
              Login as Member
            </button>
          </div>
          <p className="quick-login-note">
            These are test accounts. Admin can manage all tasks and users. Member can only manage their own tasks.
          </p>
        </div>
        
        <div className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  )
}

export default Login