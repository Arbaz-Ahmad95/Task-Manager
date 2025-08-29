
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { taskService } from '../services/taskService'
import './TaskDetail.css'

const TaskDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    tags: '',
    assignee: ''
  })
  
  const isNewTask = id === 'new'
  const canEdit = user.role === 'admin' || (task && task.assignee._id === user.id)

  useEffect(() => {
    if (!isNewTask) {
      fetchTask()
    } else {
      setLoading(false)
      setEditing(true)
      // Set default assignee to current user for new tasks
      setFormData(prev => ({
        ...prev,
        assignee: user.id
      }))
    }
  }, [id])

  const fetchTask = async () => {
    try {
      setLoading(true)
      const taskData = await taskService.getTask(id)
      setTask(taskData)
      
      // Prepopulate form data
      setFormData({
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status,
        priority: taskData.priority,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString().split('T')[0] : '',
        tags: taskData.tags.join(', '),
        assignee: taskData.assignee._id
      })
    } catch (err) {
      setError('Failed to fetch task: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setError('')
      
      // Process tags from comma-separated string to array
      const processedData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      }
      
      if (isNewTask) {
        // Create new task
        const newTask = await taskService.createTask(processedData)
        navigate(`/tasks/${newTask._id}`)
      } else {
        // Update existing task
        await taskService.updateTask(id, processedData)
        setEditing(false)
        fetchTask() // Refresh task data
      }
    } catch (err) {
      setError('Failed to save task: ' + err.message)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id)
        navigate('/tasks')
      } catch (err) {
        setError('Failed to delete task: ' + err.message)
      }
    }
  }

  const handleCancel = () => {
    if (isNewTask) {
      navigate('/tasks')
    } else {
      setEditing(false)
      // Reset form data to original values
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        tags: task.tags.join(', '),
        assignee: task.assignee._id
      })
    }
  }

  if (loading) {
    return (
      <div className="task-detail-container">
        <div className="loading">Loading task...</div>
      </div>
    )
  }

  return (
    <div className="task-detail-container">
      <div className="task-detail-header">
        <Link to="/tasks" className="back-button">
          &larr; Back to Tasks
        </Link>
        
        {!isNewTask && canEdit && !editing && (
          <div className="task-actions">
            <button 
              onClick={() => setEditing(true)}
              className="btn btn-primary"
            >
              Edit Task
            </button>
            <button 
              onClick={handleDelete}
              className="btn btn-danger"
            >
              Delete Task
            </button>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="task-detail-card">
        <h1>
          {isNewTask ? 'Create New Task' : (editing ? 'Edit Task' : task.title)}
        </h1>

        {editing ? (
          <form onSubmit={handleSubmit} className="task-form">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="urgent, important, client"
              />
            </div>

            {user.role === 'admin' && (
              <div className="form-group">
                <label>Assignee</label>
                <select
                  name="assignee"
                  value={formData.assignee}
                  onChange={handleChange}
                >
                  <option value={user.id}>Myself</option>
                  {/* In a real app, you would fetch users list */}
                  <option value="other-user-id">Other User</option>
                </select>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {isNewTask ? 'Create Task' : 'Save Changes'}
              </button>
              <button 
                type="button" 
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="task-view">
            {!isNewTask && (
              <>
                <div className="task-meta">
                  <span className={`status-badge status-${task.status}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                  <span className={`priority-badge priority-${task.priority}`}>
                    {task.priority}
                  </span>
                </div>

                <div className="task-description">
                  <h3>Description</h3>
                  <p>{task.description || 'No description provided.'}</p>
                </div>

                <div className="task-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Assignee:</span>
                    <span className="detail-value">{task.assignee.name}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Created By:</span>
                    <span className="detail-value">{task.createdBy.name}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Due Date:</span>
                    <span className="detail-value">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Created:</span>
                    <span className="detail-value">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Last Updated:</span>
                    <span className="detail-value">
                      {new Date(task.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {task.tags && task.tags.length > 0 && (
                  <div className="task-tags">
                    <h3>Tags</h3>
                    <div className="tags-container">
                      {task.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskDetail