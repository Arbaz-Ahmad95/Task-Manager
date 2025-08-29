
import request from 'supertest'
import mongoose from 'mongoose'
import app from '../app.js'
import User from '../models/User.js'

let authToken

beforeAll(async () => {
  // Connect to a test database
  await mongoose.connect(process.env.MONGO_URI_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

afterAll(async () => {
  // Clean up and close connection
  await User.deleteMany({})
  await mongoose.connection.close()
})

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'member'
      })
    
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('token')
  })

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      })
    
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('token')
    
    authToken = res.body.token
  })

  it('should not login with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    
    expect(res.statusCode).toEqual(400)
  })
})