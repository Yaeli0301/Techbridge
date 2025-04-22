const request = require('supertest');
const app = require('../server'); // Need to export app from server.js for testing
const mongoose = require('mongoose');

let token;
let jobId;
let userId;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect('mongodb://localhost:27017/itech_recruitment_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  }
});

describe('Auth and User API', () => {
  test('Register user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'candidate',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
    userId = res.body.user.id;
  });

  test('Login user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('Get current user', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('testuser@example.com');
  });
});

describe('Job API', () => {
  test('Create job', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Software Engineer',
        description: 'Develop software',
        company: 'Tech Co',
        location: 'Tel Aviv',
        salary: 15000,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Software Engineer');
    jobId = res.body._id;
  });

  test('Get jobs', async () => {
    const res = await request(app).get('/api/jobs');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Apply to job', async () => {
    const res = await request(app)
      .post(`/api/jobs/${jobId}/apply`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Application successful');
  });
});

describe('User API', () => {
  test('Get user by id', async () => {
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('testuser');
  });
});
