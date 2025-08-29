
import express from 'express'
import { body, validationResult } from 'express-validator'
import { auth } from '../middleware/auth.js'
import Task from '../models/Task.js'
import ActivityLog from '../models/ActivityLog.js'

const router = express.Router()

// Get all tasks with filtering and pagination
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    
    // Build filter object
    let filter = {}
    
    // If user is not admin, only show their tasks
    if (req.user.role !== 'admin') {
      filter.assignee = req.user.id
    }
    
    // Search filter
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $regex: req.query.search, $options: 'i' } }
      ]
    }
    
    // Status filter
    if (req.query.status) {
      filter.status = req.query.status
    }
    
    // Priority filter
    if (req.query.priority) {
      filter.priority = req.query.priority
    }
    
    // Build sort object
    let sort = {}
    if (req.query.sortBy) {
      sort[req.query.sortBy] = req.query.sortOrder === 'desc' ? -1 : 1
    } else {
      sort.dueDate = 1 // Default sort by dueDate ascending
    }
    
    const tasks = await Task.find(filter)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit)
    
    const total = await Task.countDocuments(filter)
    
    res.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get task by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }
    
    // Check if user has permission to view this task
    if (req.user.role !== 'admin' && task.assignee._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this task' })
    }
    
    res.json(task)
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Task not found' })
    }
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Create a new task
router.post('/', [
  auth,
  body('title').notEmpty().withMessage('Title is required'),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    
    const taskData = {
      ...req.body,
      createdBy: req.user.id,
      assignee: req.body.assignee || req.user.id
    }
    
    const task = new Task(taskData)
    await task.save()
    await task.populate('assignee', 'name email')
    await task.populate('createdBy', 'name email')
    
    // Log activity
    await ActivityLog.create({
      task: task._id,
      user: req.user.id,
      action: 'create',
      details: `Task "${task.title}" created`
    })
    
    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Update a task
router.put('/:id', [
  auth,
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    
    let task = await Task.findById(req.params.id)
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }
    
    // Check if user has permission to update this task
    if (req.user.role !== 'admin' && task.assignee.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' })
    }
    
    // Update task
    task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('assignee', 'name email')
    .populate('createdBy', 'name email')
    
    // Log activity
    await ActivityLog.create({
      task: task._id,
      user: req.user.id,
      action: 'update',
      details: `Task "${task.title}" updated`
    })
    
    res.json(task)
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Task not found' })
    }
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }
    
    // Check if user has permission to delete this task
    if (req.user.role !== 'admin' && task.assignee.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this task' })
    }
    
    await Task.findByIdAndDelete(req.params.id)
    
    // Log activity
    await ActivityLog.create({
      task: task._id,
      user: req.user.id,
      action: 'delete',
      details: `Task "${task.title}" deleted`
    })
    
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Task not found' })
    }
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router