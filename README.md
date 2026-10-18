# LUMIERE - Fine Jewellery Catalog

A premium boutique jewellery catalog website. Visitors browse and enquire; the admin manages products and enquiries. No checkout or payment processing.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18 + Vite, Tailwind CSS, Framer Motion, GSAP + ScrollTrigger, Lenis, react-parallax-tilt, @splinetool/react-spline |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT in httpOnly cookie |
| Image Uploads | Cloudinary (via Multer memory storage) |
| Email | Nodemailer via Gmail SMTP |
| Tests | Jest + Supertest + MongoMemoryServer |

## Project Structure

```
/
├── client/          # React + Vite frontend
└── server/          # Express + MongoDB backend
```

## Environment Variables

Create `server/.env` using this template:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/lumiere
JWT_SECRET=your_strong_random_secret_at_least_32_chars
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_gmail_app_password
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123!
CLIENT_URL=http://localhost:5173
```

> Gmail Note: Use an App Password (Google Account > Security > 2-Step Verification > App Passwords), not your main password.

## Local Setup

### 1. Install Dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
# Edit .env with your real credentials
```

### 3. Seed the Admin Account (run once)

```bash
cd server
npm run seed
# Output: Admin seeded successfully: admin@yourdomain.com
```

### 4. Run Development Servers

```bash
# Terminal 1 - Backend (port 5000)
cd server && npm run dev

# Terminal 2 - Frontend (port 5173)
cd client && npm run dev
```

- Public site: http://localhost:5173
- Admin panel: http://localhost:5173/admin/login

## Running Tests

```bash
cd server && npm test
```

Tests use in-memory MongoDB (no external DB needed). Coverage:
- auth.test.js: login, cookie, session validation
- products.test.js: CRUD, JWT protection (Cloudinary mocked)
- enquiries.test.js: submission, validation, honeypot, status toggle (Nodemailer mocked)

## Pages Overview

### Public
| Route | Description |
|---|---|
| `/` | Home with 3D Spline hero, featured products, about blurb |
| `/shop` | Collection grid, filterable by Gold / Silver / All |
| `/shop/:id` | Product detail - gallery, specs, enquire button |
| `/contact` | Enquiry form (pre-fills from ?productId & ?productName) |
| `/about` | Brand story |

### Admin (JWT protected)
| Route | Description |
|---|---|
| `/admin/login` | Admin login |
| `/admin/dashboard` | Stats - products, enquiries, new enquiries count |
| `/admin/products` | Full CRUD with Cloudinary image upload |
| `/admin/enquiries` | View enquiries, toggle status, click-to-call/email |

## API Endpoints

### Public
```
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout
GET    /api/products          ?category=gold|silver
GET    /api/products/:id
POST   /api/enquiries         rate-limited: 5/15min per IP
GET    /api/health
```

### Admin Only (JWT cookie required)
```
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
GET    /api/enquiries
PUT    /api/enquiries/:id
```

## Replacing the Spline 3D Scene

1. Sign up at spline.design
2. Design or fork a jewellery/particle scene
3. Export > React > copy the scene URL
4. Edit `client/src/components/HeroSpline.jsx` and replace the `scene` prop URL

## Production Build

```bash
cd client && npm run build    # Output: client/dist/
cd server && NODE_ENV=production npm start
```

Set `CLIENT_URL` to your live frontend domain. The frontend also needs `VITE_API_URL` set to the backend origin (for example, `https://api.yourdomain.com`, without a trailing slash or `/api`) so login and other API requests reach Express. This is required for separate frontend/backend deployments such as Vercel; otherwise `/api` requests are sent to the frontend deployment. For a same-origin deployment, configure the web server to proxy `/api` to Express.

## Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT stored in httpOnly, SameSite=Strict cookie
- Inputs sanitized with express-mongo-sanitize
- Inputs validated with express-validator
- Admin routes protected by auth middleware
- Enquiry endpoint rate-limited (5 req / 15 min)
- Honeypot field on contact form
- CORS restricted to CLIENT_URL
- .env excluded via .gitignore
- Password hash never returned in any response

## What You Need to Configure

| Item | Action |
|---|---|
| MongoDB | Create Atlas cluster, paste URI into MONGODB_URI |
| Cloudinary | Create free account, copy cloud name + API keys |
| Gmail | Enable 2FA, generate App Password, use as EMAIL_PASS |
| Admin | Set ADMIN_EMAIL/ADMIN_PASSWORD in .env, run `npm run seed` |
| Spline scene | Replace placeholder URL in HeroSpline.jsx |
| Contact info | Update phone/email in Contact.jsx and Footer.jsx |
| Currency | ProductCard/ProductDetail use USD - change Intl locale if needed |
