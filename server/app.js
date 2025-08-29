import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.js'
import taskRoutes from './routes/tasks.js'
import userRoutes from './routes/users.js'
import statsRoutes from './routes/stats.js'

dotenv.config()

const app = express()

// ✅ KEEP ONLY THIS CORS CONFIG - Remove the commented one
app.use(cors({
  origin: true,  // Allow all origins
  credentials: true
}))

app.use(express.json())

// ✅ Add this API root route
app.get('/api', (req, res) => {
  res.json({
    message: 'Task Manager API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks',
      users: '/api/users', 
      stats: '/api/stats'
    },
    documentation: 'Use the endpoints above with /api/ prefix'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Task Manager API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks',
      users: '/api/users',
      stats: '/api/stats'
    },
    documentation: 'Visit /api for detailed endpoint information'
  });
});

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/users', userRoutes)
app.use('/api/stats', statsRoutes)

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app