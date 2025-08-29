
import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle specific error status codes
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('useMockData')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      // Access forbidden
      console.error('Access forbidden:', error.response.data)
    } else if (error.response?.status === 404) {
      // Resource not found
      console.error('Resource not found:', error.response.data)
    } else if (error.code === 'ECONNABORTED') {
      // Request timeout
      console.error('Request timeout:', error.message)
    } else if (!error.response) {
      // Network error
      console.error('Network error:', error.message)
    }

    return Promise.reject(error)
  }
)

export default api