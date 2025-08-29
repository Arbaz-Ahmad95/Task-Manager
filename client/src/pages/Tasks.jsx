
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import TaskList from '../components/TaskList'
import TaskFilters from '../components/TaskFilters'
import StatsWidget from '../components/StatsWidget'
import { useAuth } from '../contexts/AuthContext'
import { taskService } from '../services/taskService'
import './Tasks.css'

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    page: 1,
    limit: 10,
    sortBy: 'dueDate',
    sortOrder: 'asc'
  })
  const [pagination, setPagination] = useState({})
  const [stats, setStats] = useState({})
  
  const { user } = useAuth()
  
  useEffect(() => {
    fetchTasks()
    fetchStats()
  }, [filters])
  
  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await taskService.getTasks(filters)
      setTasks(response.tasks)
      setPagination(response.pagination)
    } catch (err) {
      setError('Failed to fetch tasks: ' + err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const fetchStats = async () => {
    try {
      const response = await taskService.getStats()
      setStats(response)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }
  
  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId)
        fetchTasks()
        fetchStats()
      } catch (err) {
        setError('Failed to delete task: ' + err.message)
      }
    }
  }
  
  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 })
  }
  
  const handlePageChange = (page) => {
    setFilters({ ...filters, page })
  }
  
  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <h1>Tasks</h1>
        <Link to="/tasks/new" className="btn btn-primary">
          Create New Task
        </Link>
      </div>
      
      <StatsWidget stats={stats} />
      
      <TaskFilters 
        filters={filters} 
        updateFilters={updateFilters} 
      />
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="tasks-loading">
          <div className="tasks-loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      ) : (
        <TaskList 
          tasks={tasks} 
          loading={loading}
          onDelete={handleDelete}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

export default Tasks