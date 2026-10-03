const request = require('supertest');
const app = require('../src/index');
const Admin = require('../src/models/Admin');
require('./testSetup');

describe('Auth Endpoints', () => {
  const testAdmin = {
    email: 'testadmin@lumiere.com',
    password: 'testpassword123',
  };

  beforeAll(async () => {
    const admin = new Admin({
      email: testAdmin.email,
      hashedPassword: testAdmin.password,
    });
    await admin.save();
  });

  afterAll(async () => {
    await Admin.deleteMany({});
  });

  let tokenCookie = '';

  it('should return 401 with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testAdmin.email, password: 'wrongpassword' });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 200 and set token cookie with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testAdmin.email, password: testAdmin.password });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.headers['set-cookie']).toBeDefined();
    tokenCookie = res.headers['set-cookie'][0];
  });

  it('should return 401 for /api/auth/me without cookie', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 200 for /api/auth/me with valid cookie', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', tokenCookie);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.admin.email).toBe(testAdmin.email);
  });
});
