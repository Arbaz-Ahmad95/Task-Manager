
import express from 'express'
import { auth } from '../middleware/auth.js'
import Task from '../models/Task.js'

const router = express.Router()

// Get stats overview
router.get('/overview', auth, async (req, res) => {
  try {
    let filter = {}
    
    // If user is not admin, only show their tasks
    if (req.user.role !== 'admin') {
      filter.assignee = req.user.id
    }
    
    const totalTasks = await Task.countDocuments(filter)
    const todoTasks = await Task.countDocuments({ ...filter, status: 'todo' })
    const inProgressTasks = await Task.countDocuments({ ...filter, status: 'in-progress' })
    const doneTasks = await Task.countDocuments({ ...filter, status: 'done' })
    
    const highPriorityTasks = await Task.countDocuments({ ...filter, priority: 'high' })
    const mediumPriorityTasks = await Task.countDocuments({ ...filter, priority: 'medium' })
    const lowPriorityTasks = await Task.countDocuments({ ...filter, priority: 'low' })
    
    const overdueTasks = await Task.countDocuments({
      ...filter,
      dueDate: { $lt: new Date() },
      status: { $ne: 'done' }
    })
    
    res.json({
      totalTasks,
      status: {
        todo: todoTasks,
        inProgress: inProgressTasks,
        done: doneTasks
      },
      priority: {
        high: highPriorityTasks,
        medium: mediumPriorityTasks,
        low: lowPriorityTasks
      },
      overdue: overdueTasks
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router