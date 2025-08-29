
import api from './api'
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  },

  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify')
      return response.data.user
    } catch (error) {
      throw new Error('Token verification failed')
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
      localStorage.removeItem('token')
      localStorage.removeItem('useMockData')
      localStorage.removeItem('userData')
      navigate('/login');
    } catch (error) {
      throw new Error('Logout failed')
       
    }
 }
}

export default authService