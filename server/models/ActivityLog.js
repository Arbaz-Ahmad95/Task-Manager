
import mongoose from 'mongoose'

const activityLogSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: ['create', 'update', 'delete'],
    required: true
  },
  details: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

export default mongoose.model('ActivityLog', activityLogSchema)