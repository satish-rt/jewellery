const request = require('supertest');
const app = require('../src/index');
const Enquiry = require('../src/models/Enquiry');
const Admin = require('../src/models/Admin');
const jwt = require('jsonwebtoken');
require('./testSetup');

jest.mock('../src/utils/mailer', () => ({
  sendEnquiryNotification: jest.fn().mockResolvedValue(true),
}));

describe('Enquiry Endpoints', () => {
  let tokenCookie = '';
  let enquiryId = '';

  beforeAll(async () => {
    const admin = new Admin({
      email: 'enquiryadmin@lumiere.com',
      hashedPassword: 'password123',
    });
    await admin.save();
    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    tokenCookie = `token=${token}`;
  });

  afterAll(async () => {
    await Enquiry.deleteMany({});
    await Admin.deleteMany({});
  });

  it('should create enquiry with valid data', async () => {
    const res = await request(app)
      .post('/api/enquiries')
      .send({
        name: 'John Doe',
        phone: '1234567890',
        email: 'john@example.com',
        message: 'I am interested in this product.',
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
  });

  it('should return 400 with missing fields', async () => {
    const res = await request(app)
      .post('/api/enquiries')
      .send({ name: 'John Doe' });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('should silently ignore request if honeypot filled', async () => {
    const res = await request(app)
      .post('/api/enquiries')
      .send({
        name: 'Bot',
        phone: '123',
        email: 'bot@bot.com',
        message: 'spam message here',
        _honey: 'spam',
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  it('should return 401 for GET /api/enquiries without auth', async () => {
    const res = await request(app).get('/api/enquiries');
    expect(res.statusCode).toEqual(401);
  });

  it('should return 200 for GET /api/enquiries with auth', async () => {
    const res = await request(app)
      .get('/api/enquiries')
      .set('Cookie', tokenCookie);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.enquiries.length).toBeGreaterThan(0);
    enquiryId = res.body.enquiries[0]._id;
  });

  it('should return 401 for PUT /api/enquiries/:id without auth', async () => {
    const res = await request(app).put(`/api/enquiries/${enquiryId}`);
    expect(res.statusCode).toEqual(401);
  });

  it('should update enquiry status with auth', async () => {
    const res = await request(app)
      .put(`/api/enquiries/${enquiryId}`)
      .set('Cookie', tokenCookie)
      .send({ status: 'contacted' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.enquiry.status).toBe('contacted');
  });
});
