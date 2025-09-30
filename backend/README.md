# Civil Path Study - Node.js Backend with Supabase

A modern Node.js backend for the Civil Path Study platform using Supabase as the database.

## Features

- **RESTful API**: Complete CRUD operations for all entities
- **Supabase Integration**: PostgreSQL database with real-time capabilities
- **JWT Authentication**: Secure admin authentication
- **File Upload**: Support for PDF, images, and documents
- **CORS Enabled**: Ready for frontend integration
- **Admin Panel**: Web-based admin interface

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend-node
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API to get your credentials
3. Copy `.env.example` to `.env` and update with your Supabase credentials:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
JWT_SECRET=your_random_jwt_secret
PORT=3001
```

### 3. Database Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the contents of `supabase-schema.sql` to create all tables and sample data

### 4. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3001`

### 5. Admin Panel Access

Open `http://localhost:3001/admin.html` in your browser

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Exams
- `GET /api/exams` - Get all exams
- `GET /api/exams?id={id}` - Get single exam
- `POST /api/exams` - Create exam (admin only)
- `PUT /api/exams/{id}` - Update exam (admin only)
- `DELETE /api/exams/{id}` - Delete exam (admin only)

### Resources
- `GET /api/resources` - Get all resources
- `GET /api/resources?exam_id={id}` - Get resources by exam
- `POST /api/resources` - Create resource (admin only)
- `PUT /api/resources/{id}` - Update resource (admin only)
- `DELETE /api/resources/{id}` - Delete resource (admin only)

### Blog Posts
- `GET /api/blog` - Get all blog posts
- `GET /api/blog?id={id}` - Get single blog post
- `GET /api/blog?category_id={id}` - Get posts by category
- `POST /api/blog` - Create blog post (admin only)
- `PUT /api/blog/{id}` - Update blog post (admin only)
- `DELETE /api/blog/{id}` - Delete blog post (admin only)

### Categories
- `GET /api/categories` - Get all resource categories
- `GET /api/categories?exam_id={id}` - Get categories by exam
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/{id}` - Update category (admin only)
- `DELETE /api/categories/{id}` - Delete category (admin only)

### File Upload
- `POST /api/upload` - Upload files (admin only)

### Health Check
- `GET /api/health` - Server health status

## Database Schema

### Tables Created in Supabase:

1. **admin_users** - Admin authentication
2. **exams** - Examination information
3. **resource_categories** - Resource type categories
4. **resources** - Study materials and files
5. **blog_categories** - Blog post categories
6. **blog_posts** - Blog articles

### Sample Data Included:

- 5 Exams (UPSC, MPSC variants)
- 7 Resource categories per exam
- 6 Blog categories
- Default admin user

## Frontend Integration

Update your frontend API service to point to the new backend:

```typescript
const API_BASE_URL = 'http://localhost:3001/api';
```

The API responses maintain the same structure as the PHP backend for seamless migration.

## Security Features

- JWT token-based authentication
- CORS configuration for cross-origin requests
- File type validation for uploads
- SQL injection prevention (Supabase handles this)
- Input sanitization

## File Structure

```
backend-node/
├── config/
│   └── supabase.js          # Supabase configuration
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── exams.js             # Exam management routes
│   ├── resources.js         # Resource management routes
│   ├── blog.js              # Blog management routes
│   ├── categories.js        # Category management routes
│   └── upload.js            # File upload routes
├── uploads/                 # File storage directory
├── admin.html               # Admin panel interface
├── server.js                # Main server file
├── supabase-schema.sql      # Database schema
├── package.json             # Dependencies
└── .env.example             # Environment variables template
```

## Migration from PHP Backend

1. **Database**: Export data from MySQL and import to Supabase using the provided schema
2. **Files**: Copy uploaded files from PHP backend to `uploads/` directory
3. **Frontend**: Update API base URL in frontend service
4. **Admin Panel**: Use the new web-based admin panel at `/admin.html`

## Development

### Adding New Endpoints

1. Create route file in `routes/` directory
2. Add route to `server.js`
3. Follow existing patterns for authentication and error handling

### Environment Variables

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Public API key for client-side operations
- `SUPABASE_SERVICE_KEY`: Service role key for admin operations
- `JWT_SECRET`: Secret key for JWT token signing
- `PORT`: Server port (default: 3001)

## Production Deployment

1. Set up environment variables on your hosting platform
2. Ensure Supabase project is configured for production
3. Update CORS settings if needed
4. Set up file storage (consider cloud storage for production)

The backend is now ready to replace the PHP backend with modern Node.js and Supabase infrastructure!