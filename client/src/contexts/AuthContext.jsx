
import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token')
    const useMockData = localStorage.getItem('useMockData') === 'true'
    
    if (token && !useMockData) {
      try {
        const userData = await authService.verifyToken()
        setUser(userData)
        // Store user data for task filtering
        localStorage.setItem('userData', JSON.stringify(userData))
      } catch (error) {
        console.log('Token verification failed, using mock data')
        // Fall back to mock data if backend verification fails
        const mockUser = { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' }
        setUser(mockUser)
        localStorage.setItem('useMockData', 'true')
        localStorage.setItem('userData', JSON.stringify(mockUser))
      }
    } else if (useMockData) {
      // Use mock user data
      try {
        const userData = localStorage.getItem('userData')
        if (userData) {
          setUser(JSON.parse(userData))
        } else {
          const mockUser = { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' }
          setUser(mockUser)
          localStorage.setItem('userData', JSON.stringify(mockUser))
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
        const mockUser = { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' }
        setUser(mockUser)
        localStorage.setItem('userData', JSON.stringify(mockUser))
      }
    }
    
    setLoading(false)
  }

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      setUser(response.user)
      localStorage.setItem('token', response.token)
      localStorage.setItem('useMockData', 'false')
      // Store user data for task filtering
      localStorage.setItem('userData', JSON.stringify(response.user))
      return response
    } catch (error) {
      // If backend login fails, use mock login with test accounts
      console.log('Using mock login with test accounts')
      
      // Test accounts for quick login
      const testAccounts = {
        'admin@example.com': { 
          id: '1', 
          name: 'Admin User', 
          email: 'admin@example.com', 
          role: 'admin'
        },
        'john@example.com': { 
          id: '2', 
          name: 'John Developer', 
          email: 'john@example.com', 
          role: 'member'
        },
        'sarah@example.com': { 
          id: '3', 
          name: 'Sarah Designer', 
          email: 'sarah@example.com', 
          role: 'member'
        },
        'member@example.com': { 
          id: '4', 
          name: 'Member User', 
          email: 'member@example.com', 
          role: 'member'
        }
      }
      
      if (testAccounts[email] && password === 'password') {
        const user = testAccounts[email]
        setUser(user)
        localStorage.setItem('useMockData', 'true')
        localStorage.setItem('userData', JSON.stringify(user))
        return { user, token: 'mock-token' }
      } else {
        throw new Error('Invalid credentials. Use: admin@example.com/password, john@example.com/password, sarah@example.com/password, or member@example.com/password')
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      setUser(response.user)
      localStorage.setItem('token', response.token)
      localStorage.setItem('useMockData', 'false')
      // Store user data for task filtering
      localStorage.setItem('userData', JSON.stringify(response.user))
      return response
    } catch (error) {
      // If backend registration fails, use mock registration
      console.log('Using mock registration')
      const mockUser = { 
        id: Date.now().toString(), 
        name: userData.name, 
        email: userData.email, 
        role: userData.role || 'member' 
      }
      setUser(mockUser)
      localStorage.setItem('useMockData', 'true')
      localStorage.setItem('userData', JSON.stringify(mockUser))
      return { user: mockUser, token: 'mock-token' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('useMockData')
    localStorage.removeItem('userData')
    // Call backend logout if needed
    authService.logout().catch(console.error)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}