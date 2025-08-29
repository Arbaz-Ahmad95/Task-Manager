
import api from './api'

// Mock data for development when backend is not available
const mockTasks = [
  // Admin's tasks
  {
    _id: '1',
    title: 'Review Team Performance',
    description: 'Conduct quarterly performance reviews for all team members',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2023-12-15T00:00:00.000Z',
    tags: ['management', 'reviews'],
    assignee: { _id: '1', name: 'Admin User', email: 'admin@example.com' },
    createdBy: { _id: '1', name: 'Admin User', email: 'admin@example.com' },
    createdAt: '2023-12-10T10:30:00.000Z',
    updatedAt: '2023-12-12T14:45:00.000Z'
  },
  {
    _id: '2',
    title: 'Plan Company Meeting',
    description: 'Organize the annual company-wide meeting with all departments',
    status: 'todo',
    priority: 'medium',
    dueDate: '2023-12-20T00:00:00.000Z',
    tags: ['event', 'management'],
    assignee: { _id: '1', name: 'Admin User', email: 'admin@example.com' },
    createdBy: { _id: '1', name: 'Admin User', email: 'admin@example.com' },
    createdAt: '2023-12-11T09:15:00.000Z',
    updatedAt: '2023-12-11T09:15:00.000Z'
  },

  // Member 1's tasks
  {
    _id: '3',
    title: 'Complete Frontend Development',
    description: 'Finish the React components for the user dashboard',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2023-12-18T00:00:00.000Z',
    tags: ['development', 'frontend'],
    assignee: { _id: '2', name: 'John Developer', email: 'john@example.com' },
    createdBy: { _id: '2', name: 'John Developer', email: 'john@example.com' },
    createdAt: '2023-12-05T14:20:00.000Z',
    updatedAt: '2023-12-12T16:30:00.000Z'
  },
  {
    _id: '4',
    title: 'Write API Documentation',
    description: 'Create comprehensive documentation for the new REST API endpoints',
    status: 'todo',
    priority: 'medium',
    dueDate: '2023-12-22T00:00:00.000Z',
    tags: ['documentation', 'backend'],
    assignee: { _id: '2', name: 'John Developer', email: 'john@example.com' },
    createdBy: { _id: '2', name: 'John Developer', email: 'john@example.com' },
    createdAt: '2023-12-08T11:45:00.000Z',
    updatedAt: '2023-12-08T11:45:00.000Z'
  },

  // Member 2's tasks
  {
    _id: '5',
    title: 'Design User Interface',
    description: 'Create UI mockups for the new mobile application',
    status: 'done',
    priority: 'high',
    dueDate: '2023-12-10T00:00:00.000Z',
    tags: ['design', 'ui/ux'],
    assignee: { _id: '3', name: 'Sarah Designer', email: 'sarah@example.com' },
    createdBy: { _id: '3', name: 'Sarah Designer', email: 'sarah@example.com' },
    createdAt: '2023-12-01T09:30:00.000Z',
    updatedAt: '2023-12-09T15:20:00.000Z'
  },
  {
    _id: '6',
    title: 'User Testing Session',
    description: 'Conduct usability testing with focus group participants',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2023-12-19T00:00:00.000Z',
    tags: ['testing', 'feedback'],
    assignee: { _id: '3', name: 'Sarah Designer', email: 'sarah@example.com' },
    createdBy: { _id: '3', name: 'Sarah Designer', email: 'sarah@example.com' },
    createdAt: '2023-12-07T13:15:00.000Z',
    updatedAt: '2023-12-13T10:45:00.000Z'
  }
]

const mockStats = {
  totalTasks: 15,
  status: {
    todo: 5,
    inProgress: 7,
    done: 3
  },
  priority: {
    high: 3,
    medium: 8,
    low: 4
  },
  overdue: 2
}

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Check if we should use mock data (when backend is not available)
const shouldUseMockData = () => {
  return localStorage.getItem('useMockData') === 'true'
}

// Get current user data from localStorage
const getCurrentUser = () => {
  const useMockData = localStorage.getItem('useMockData') === 'true'
  let currentUser = { id: '1', role: 'admin' } // Default to admin
  
  if (useMockData) {
    try {
      const userData = localStorage.getItem('userData')
      if (userData) {
        currentUser = JSON.parse(userData)
      }
    } catch (e) {
      console.error('Error parsing user data:', e)
    }
  }
  
  return currentUser
}

export const taskService = {
  getTasks: async (filters = {}) => {
    if (shouldUseMockData()) {
      console.log('Using mock tasks data')
      await delay(500)
      
      const currentUser = getCurrentUser()
      let filteredTasks = [...mockTasks]
      
      // If user is not admin, filter to show only their tasks
      if (currentUser.role !== 'admin') {
        filteredTasks = filteredTasks.filter(task => 
          task.assignee._id === currentUser.id || task.createdBy._id === currentUser.id
        )
      }
      
      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredTasks = filteredTasks.filter(task => 
          task.title.toLowerCase().includes(searchTerm) ||
          task.description.toLowerCase().includes(searchTerm) ||
          task.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        )
      }
      
      // Apply status filter
      if (filters.status) {
        filteredTasks = filteredTasks.filter(task => task.status === filters.status)
      }
      
      // Apply priority filter
      if (filters.priority) {
        filteredTasks = filteredTasks.filter(task => task.priority === filters.priority)
      }
      
      // Apply pagination
      const page = filters.page || 1
      const limit = filters.limit || 10
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedTasks = filteredTasks.slice(startIndex, endIndex)
      
      return {
        tasks: paginatedTasks,
        pagination: {
          page,
          limit,
          total: filteredTasks.length,
          pages: Math.ceil(filteredTasks.length / limit)
        }
      }
    }

    try {
      const response = await api.get('/tasks', { params: filters })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks')
    }
  },

  getTask: async (id) => {
    if (shouldUseMockData()) {
      console.log('Using mock task data')
      await delay(300)
      const task = mockTasks.find(t => t._id === id)
      if (!task) throw new Error('Task not found')
      
      // Check if user has permission to view this task
      const currentUser = getCurrentUser()
      if (currentUser.role !== 'admin' && 
          task.assignee._id !== currentUser.id && 
          task.createdBy._id !== currentUser.id) {
        throw new Error('Not authorized to access this task')
      }
      
      return task
    }

    try {
      const response = await api.get(`/tasks/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch task')
    }
  },

  createTask: async (taskData) => {
    if (shouldUseMockData()) {
      console.log('Using mock task creation')
      await delay(500)
      
      const currentUser = getCurrentUser()
      const newTask = {
        _id: Date.now().toString(),
        ...taskData,
        assignee: { 
          _id: taskData.assignee || currentUser.id, 
          name: currentUser.name, 
          email: currentUser.email 
        },
        createdBy: { 
          _id: currentUser.id, 
          name: currentUser.name, 
          email: currentUser.email 
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      mockTasks.push(newTask)
      return newTask
    }

    try {
      const response = await api.post('/tasks', taskData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create task')
    }
  },

  updateTask: async (id, taskData) => {
    if (shouldUseMockData()) {
      console.log('Using mock task update')
      await delay(500)
      
      const currentUser = getCurrentUser()
      const index = mockTasks.findIndex(t => t._id === id)
      if (index === -1) throw new Error('Task not found')
      
      // Check if user has permission to update this task
      const task = mockTasks[index]
      if (currentUser.role !== 'admin' && 
          task.assignee._id !== currentUser.id && 
          task.createdBy._id !== currentUser.id) {
        throw new Error('Not authorized to update this task')
      }
      
      mockTasks[index] = { 
        ...mockTasks[index], 
        ...taskData, 
        updatedAt: new Date().toISOString() 
      }
      return mockTasks[index]
    }

    try {
      const response = await api.put(`/tasks/${id}`, taskData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update task')
    }
  },

  deleteTask: async (id) => {
    if (shouldUseMockData()) {
      console.log('Using mock task deletion')
      await delay(300)
      
      const currentUser = getCurrentUser()
      const index = mockTasks.findIndex(t => t._id === id)
      if (index === -1) throw new Error('Task not found')
      
      // Check if user has permission to delete this task
      const task = mockTasks[index]
      if (currentUser.role !== 'admin' && 
          task.assignee._id !== currentUser.id && 
          task.createdBy._id !== currentUser.id) {
        throw new Error('Not authorized to delete this task')
      }
      
      mockTasks.splice(index, 1)
      return
    }

    try {
      await api.delete(`/tasks/${id}`)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete task')
    }
  },

  getStats: async () => {
    if (shouldUseMockData()) {
      console.log('Using mock stats data')
      await delay(400)
      
      const currentUser = getCurrentUser()
      let stats = { ...mockStats }
      
      // If user is not admin, filter stats to show only their tasks
      if (currentUser.role !== 'admin') {
        const userTasks = mockTasks.filter(task => 
          task.assignee._id === currentUser.id || task.createdBy._id === currentUser.id
        )
        
        stats.totalTasks = userTasks.length
        stats.status = {
          todo: userTasks.filter(t => t.status === 'todo').length,
          inProgress: userTasks.filter(t => t.status === 'in-progress').length,
          done: userTasks.filter(t => t.status === 'done').length
        }
        stats.priority = {
          high: userTasks.filter(t => t.priority === 'high').length,
          medium: userTasks.filter(t => t.priority === 'medium').length,
          low: userTasks.filter(t => t.priority === 'low').length
        }
        stats.overdue = userTasks.filter(t => 
          t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
        ).length
      }
      
      return stats
    }

    try {
      const response = await api.get('/stats/overview')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch stats')
    }
  }
}

export default taskService