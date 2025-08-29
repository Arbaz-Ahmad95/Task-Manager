
import express from 'express'
import { auth, adminAuth } from '../middleware/auth.js'
import User from '../models/User.js'

const router = express.Router()

// Get all users (admin only)
router.get('/', [auth, adminAuth], async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Update user role (admin only)
router.patch('/:id/role', [auth, adminAuth], async (req, res) => {
  try {
    const { role } = req.body
    
    if (!['admin', 'member'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password')
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    res.json(user)
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router