const request = require('supertest');
const app = require('../src/index');
const Product = require('../src/models/Product');
const Admin = require('../src/models/Admin');
const jwt = require('jsonwebtoken');
require('./testSetup');

jest.mock('../src/utils/cloudinary', () => ({
  uploadToCloudinary: jest.fn().mockResolvedValue({ url: 'http://res.cloudinary.com/test', publicId: 'test_id' }),
  deleteFromCloudinary: jest.fn().mockResolvedValue(true),
}));

describe('Product Endpoints', () => {
  let tokenCookie = '';
  let productId = '';

  beforeAll(async () => {
    const admin = new Admin({
      email: 'productadmin@lumiere.com',
      hashedPassword: 'password123',
    });
    await admin.save();

    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    tokenCookie = `token=${token}`;
  });

  afterAll(async () => {
    await Product.deleteMany({});
    await Admin.deleteMany({});
  });

  it('should return 200 with empty array initially', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.products).toEqual([]);
  });

  it('should filter products by search text and price range', async () => {
    await Product.create([
      { name: 'Gold Ring', category: 'gold', price: 500, weight: '10g', purity: '22K', description: 'A beautiful gold ring', images: [{ url: 'https://example.com/gold-ring.jpg' }] },
      { name: 'Silver Bracelet', category: 'silver', price: 2000, weight: '15g', purity: '925', description: 'A beautiful silver bracelet', images: [{ url: 'https://example.com/silver-bracelet.jpg' }] },
      { name: 'Diamond Necklace', category: 'gold', price: 12000, weight: '20g', purity: '22K', description: 'A luxury necklace', images: [{ url: 'https://example.com/diamond-necklace.jpg' }] },
    ]);

    const res = await request(app).get('/api/products?category=gold&q=ring&minPrice=100&maxPrice=800');

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.products).toHaveLength(1);
    expect(res.body.products[0].name).toBe('Gold Ring');
  });

  it('should return 401 for POST /api/products without auth', async () => {
    const res = await request(app).post('/api/products');
    expect(res.statusCode).toEqual(401);
  });

  it('should create product with auth', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Cookie', tokenCookie)
      .field('name', 'Gold Ring')
      .field('category', 'gold')
      .field('price', 500)
      .field('weight', '10g')
      .field('purity', '22K')
      .field('description', 'A beautiful gold ring')
      .attach('images', Buffer.from('fake image'), 'test.jpg');
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.product.name).toBe('Gold Ring');
    productId = res.body.product._id;
  });

  it('should return 200 for GET /api/products/:id with valid id', async () => {
    const res = await request(app).get(`/api/products/${productId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.product._id).toBe(productId);
  });

  it('should return 404 for GET /api/products/:id with invalid format id', async () => {
    const res = await request(app).get('/api/products/invalid123');
    expect(res.statusCode).toEqual(404); // Using 404 per specs, CastError mapped to 400 or 404. Let's see errorHandler, it maps CastError to 400.
    // Wait, the controller explicitly checks isValidObjectId and returns 404.
  });

  it('should return 401 for DELETE /api/products/:id without auth', async () => {
    const res = await request(app).delete(`/api/products/${productId}`);
    expect(res.statusCode).toEqual(401);
  });

  it('should delete product with auth', async () => {
    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set('Cookie', tokenCookie);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});
