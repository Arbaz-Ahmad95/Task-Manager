
import { Link } from 'react-router-dom'
import './TaskList.css'

const TaskList = ({ tasks, loading, onDelete, pagination, onPageChange }) => {
  if (loading) {
    return (
      <div className="task-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading tasks...</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <h3>No tasks found</h3>
        <p>Create your first task to get started!</p>
        <Link to="/tasks/new" className="btn btn-primary">
          Create Task
        </Link>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const isOverdue = (dueDate) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date() && new Date(dueDate).setHours(0, 0, 0, 0) !== new Date().setHours(0, 0, 0, 0)
  }

  return (
    <div className="task-list-container">
      <div className="task-list">
        {tasks.map((task) => (
          <div key={task._id} className="task-card">
            <div className="task-card-header">
              <h3 className="task-title">
                <Link to={`/tasks/${task._id}`}>{task.title}</Link>
              </h3>
              <div className="task-meta">
                <span className={`status-badge status-${task.status}`}>
                  {task.status.replace('-', ' ')}
                </span>
                <span className={`priority-badge priority-${task.priority}`}>
                  {task.priority}
                </span>
              </div>
            </div>

            <div className="task-card-body">
              <p className="task-description">
                {task.description || 'No description provided.'}
              </p>

              <div className="task-details">
                <div className="task-detail">
                  <span className="detail-label">Assignee:</span>
                  <span className="detail-value">{task.assignee.name}</span>
                </div>
                
                {task.dueDate && (
                  <div className="task-detail">
                    <span className="detail-label">Due:</span>
                    <span className={`detail-value ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
                      {formatDate(task.dueDate)}
                      {isOverdue(task.dueDate) && ' ⚠️'}
                    </span>
                  </div>
                )}
              </div>

              {task.tags && task.tags.length > 0 && (
                <div className="task-tags">
                  {task.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="task-card-actions">
              <Link to={`/tasks/${task._id}`} className="btn btn-secondary btn-sm">
                View
              </Link>
              <button
                onClick={() => onDelete(task._id)}
                className="btn btn-danger btn-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="pagination">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          
          <span className="pagination-info">
            Page {pagination.page} of {pagination.pages}
          </span>
          
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default TaskList