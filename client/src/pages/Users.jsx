
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './Users.css'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  // Mock data for users (in real app, you would fetch from API)
  const mockUsers = [
    { _id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', createdAt: '2023-01-15' },
    { _id: '2', name: 'John Doe', email: 'john@example.com', role: 'member', createdAt: '2023-02-20' },
    { _id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'member', createdAt: '2023-03-10' },
    { _id: '4', name: 'Bob Johnson', email: 'bob@example.com', role: 'member', createdAt: '2023-04-05' }
  ]

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      // In a real app, you would use:
      // const response = await userService.getUsers()
      // setUsers(response.data)
      
      // Using mock data for now
      setTimeout(() => {
        setUsers(mockUsers)
        setLoading(false)
      }, 500)
    } catch (err) {
      setError('Failed to fetch users: ' + err.message)
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      // In a real app, you would use:
      // await userService.updateUserRole(userId, newRole)
      
      // Update local state for mock data
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u._id === userId ? { ...u, role: newRole } : u
        )
      )
    } catch (err) {
      setError('Failed to update user role: ' + err.message)
    }
  }

  if (user.role !== 'admin') {
    return (
      <div className="users-container">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You need administrator privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="users-container">
      <div className="users-header">
        <h1>User Management</h1>
        <p>Manage user roles and permissions</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => (
                <tr key={userItem._id}>
                  <td>
                    <div className="user-info">
                      <span className="user-name">{userItem.name}</span>
                      {userItem._id === user.id && <span className="current-user">(You)</span>}
                    </div>
                  </td>
                  <td>{userItem.email}</td>
                  <td>
                    <span className={`role-badge role-${userItem.role}`}>
                      {userItem.role}
                    </span>
                  </td>
                  <td>{new Date(userItem.createdAt).toLocaleDateString()}</td>
                  <td>
                    {userItem._id !== user.id && (
                      <select
                        value={userItem.role}
                        onChange={(e) => handleRoleChange(userItem._id, e.target.value)}
                        className="role-select"
                        disabled={userItem._id === user.id}
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                    {userItem._id === user.id && (
                      <span className="no-actions">No actions available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="users-info">
        <h3>About User Roles</h3>
        <div className="roles-explanation">
          <div className="role-item">
            <span className="role-badge role-admin">Admin</span>
            <p>Can manage all tasks and users, change user roles, and access all features.</p>
          </div>
          <div className="role-item">
            <span className="role-badge role-member">Member</span>
            <p>Can only manage their own tasks and view assigned tasks.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Users