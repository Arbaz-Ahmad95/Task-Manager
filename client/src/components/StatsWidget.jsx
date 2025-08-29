
import './StatsWidget.css'

const StatsWidget = ({ stats }) => {
  if (!stats) return null

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      color: '#4a90e2',
      icon: '📋'
    },
    {
      title: 'To Do',
      value: stats.status?.todo || 0,
      color: '#1976d2',
      icon: '⏳'
    },
    {
      title: 'In Progress',
      value: stats.status?.inProgress || 0,
      color: '#f57c00',
      icon: '🚧'
    },
    {
      title: 'Done',
      value: stats.status?.done || 0,
      color: '#388e3c',
      icon: '✅'
    },
    {
      title: 'Overdue',
      value: stats.overdue || 0,
      color: '#dc3545',
      icon: '⚠️'
    },
    {
      title: 'High Priority',
      value: stats.priority?.high || 0,
      color: '#dc3545',
      icon: '🔥'
    }
  ]

  return (
    <div className="stats-widget">
      <h3>Task Overview</h3>
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <div className="stat-value" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="stat-title">{stat.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StatsWidget