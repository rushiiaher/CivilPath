# CivilPath Study Platform - Technical Documentation

## How This Project Works

This document explains the technical architecture, implementation details, and working mechanisms of the CivilPath Study Platform.

## Project Overview

The CivilPath Study Platform is a full-stack web application built with React.js frontend, Node.js backend APIs, and MongoDB database. It uses Vercel serverless functions for deployment and provides a comprehensive learning management system for civil services exam preparation.

## Architecture Overview

```
Frontend (React.js + TypeScript)
        ↓ HTTP Requests
Vercel Serverless Functions (Node.js + Express.js)
        ↓ Database Queries
MongoDB Atlas (Cloud Database)
```

## Frontend Architecture

### Technology Stack
- **React.js 18** - Component-based UI framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and development server
- **React Router** - Client-side routing

### Key Frontend Files Structure

```
frontend/src/
├── components/
│   ├── Layout.tsx              # Main app layout wrapper
│   ├── ResourceCard.tsx        # Resource display component
│   └── ExamCardGrid.tsx        # Exam cards grid component
├── pages/
│   ├── Home.tsx               # Landing page
│   ├── ExamDetail.tsx         # Exam details and resources
│   ├── Blog.tsx               # Blog listing page
│   ├── BlogDetail.tsx         # Individual blog post
│   └── admin/
│       ├── AdminDashboard.tsx  # Admin main dashboard
│       ├── AdminBlog.tsx       # Blog management
│       ├── AdminResources.tsx  # Resource management
│       ├── AdminSyllabus.tsx   # Syllabus management
│       ├── AdminStages.tsx     # Exam stages management
│       └── AdminSubjects.tsx   # Subject management
├── services/
│   └── api.ts                 # API service functions
└── utils/
    └── googleDrive.ts         # Google Drive URL utilities
```

### How Frontend Works

1. **Component Architecture**: Uses React functional components with hooks
2. **State Management**: Local state with useState and useEffect hooks
3. **API Communication**: Axios/fetch for HTTP requests to backend APIs
4. **Routing**: React Router for navigation between pages
5. **Styling**: Tailwind CSS for responsive design
6. **Type Safety**: TypeScript interfaces for data structures

### Key Frontend Features

#### Public Interface
- **Home Page**: Displays featured exams in a grid layout
- **Exam Detail Page**: Shows exam information with tabbed navigation for stages
- **Blog System**: Lists and displays educational blog posts
- **Resource Access**: Download links for study materials

#### Admin Interface
- **Dashboard**: Overview of system statistics
- **Content Management**: CRUD operations for all content types
- **Authentication**: JWT-based admin login system
- **File Upload**: Image upload with size validation (500KB limit)

## Backend Architecture (Vercel Functions)

### Technology Stack
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB + Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **Vercel Functions** - Serverless deployment

### API Files Structure

```
frontend/api/
├── admin-all.js              # Consolidated admin API (main backend)
├── exams.js                  # Public exam data API
├── blog.js                   # Public blog content API
└── auth.js                   # Authentication API
```

### How Vercel Functions Work

Vercel Functions are serverless functions that run on-demand. Each file in the `/api` directory becomes an API endpoint:

- `api/admin-all.js` → `/api/admin-all`
- `api/exams.js` → `/api/exams`
- `api/blog.js` → `/api/blog`

### Main Backend File: admin-all.js

This is the core backend file that handles all admin operations. Here's how it works:

#### File Structure and Content

```javascript
// admin-all.js - Main Backend API Handler

import jwt from 'jsonwebtoken';

// Authentication middleware
const authenticateToken = (req) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

// Main handler function
export default async function handler(req, res) {
  // CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Database connection
  const mongoose = await import('mongoose');
  if (mongoose.default.connection.readyState !== 1) {
    await mongoose.default.connect(process.env.MONGODB_URI);
  }

  // Route to specific handlers based on endpoint parameter
  const { endpoint } = req.query;
  
  if (endpoint === 'stages') {
    return handleStages(req, res, Stage);
  } else if (endpoint === 'blog') {
    return handleBlog(req, res, BlogPost);
  } else if (endpoint === 'resources') {
    return handleResources(req, res, Resource);
  } else if (endpoint === 'syllabus') {
    return handleSyllabus(req, res, Resource, ResourceType);
  }
  // ... more endpoints
}
```

#### How API Routing Works

The `admin-all.js` file uses query parameters to route to different handlers:

- `/api/admin-all?endpoint=blog` → Blog management
- `/api/admin-all?endpoint=resources` → Resource management  
- `/api/admin-all?endpoint=stages` → Stage management
- `/api/admin-all?endpoint=syllabus` → Syllabus management

#### CRUD Operations Implementation

Each handler implements full CRUD operations:

```javascript
async function handleBlog(req, res, BlogPost) {
  const { method, query } = req;

  // Authentication for write operations
  if (['POST', 'PUT', 'DELETE'].includes(method)) {
    const user = authenticateToken(req);
    if (!user) return res.status(401).json({ error: 'Access token required' });
  }

  if (method === 'GET') {
    // Read operation - fetch blog posts
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    return res.json({ records: posts });
  }

  if (method === 'POST') {
    // Create operation - add new blog post
    const post = new BlogPost(req.body);
    const savedPost = await post.save();
    return res.status(201).json(savedPost);
  }

  if (method === 'PUT') {
    // Update operation - modify existing post
    const { id } = query;
    const updatedPost = await BlogPost.findByIdAndUpdate(id, req.body, { new: true });
    return res.json(updatedPost);
  }

  if (method === 'DELETE') {
    // Delete operation - remove post
    const { id } = query;
    await BlogPost.findByIdAndDelete(id);
    return res.json({ message: 'Blog post deleted successfully' });
  }
}
```

## Database Architecture (MongoDB)

### Database Schema Design

The application uses MongoDB with the following collections:

#### 1. Exams Collection
```javascript
const examSchema = {
  name: String,           // "UPSC Civil Services"
  slug: String,           // "upsc-civil-services"
  category: String,       // "Central Government"
  description: String,    // Exam description
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. Stages Collection
```javascript
const stageSchema = {
  exam_id: String,        // Reference to exam
  name: String,           // "Prelims", "Mains", "Interview"
  slug: String,           // "prelims"
  description: String,    // Stage description
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. Resources Collection
```javascript
const resourceSchema = {
  exam_id: String,        // Reference to exam
  stage_id: String,       // Reference to stage
  subject_id: String,     // Reference to subject
  resource_type_id: String, // Reference to resource type
  title: String,          // "UPSC Prelims 2024 Paper"
  description: String,    // Resource description
  file_path: String,      // Local file path
  external_url: String,   // External download URL
  author: String,         // Resource author
  year: String,           // Publication year
  download_count: Number, // Download tracking
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. Blog Posts Collection
```javascript
const blogPostSchema = {
  title: String,          // Blog post title
  slug: String,           // URL-friendly title
  excerpt: String,        // Short description
  content: String,        // Full blog content (HTML)
  author: String,         // Post author
  featured_image: String, // Main image URL
  images: [String],       // Additional images
  read_time: Number,      // Estimated read time
  status: String,         // "published" or "draft"
  published_at: Date,     // Publication date
  createdAt: Date,
  updatedAt: Date
}
```

### How Database Operations Work

1. **Connection**: MongoDB Atlas cloud database connection via Mongoose
2. **Models**: Mongoose schemas define data structure and validation
3. **Queries**: Mongoose ODM for database operations
4. **Indexing**: Optimized queries with proper indexing
5. **Relationships**: Document references between collections

## Authentication System

### How JWT Authentication Works

1. **Admin Login**: Admin enters credentials
2. **Token Generation**: Server creates JWT token with user info
3. **Token Storage**: Frontend stores token in localStorage
4. **Request Authentication**: Token sent in Authorization header
5. **Token Verification**: Server validates token for protected routes

```javascript
// Token generation (login)
const token = jwt.sign({ userId: admin.id, role: 'admin' }, process.env.JWT_SECRET);

// Token verification (protected routes)
const user = jwt.verify(token, process.env.JWT_SECRET);
```

## Frontend-Backend Communication

### How API Calls Work

1. **Frontend Request**: React component makes HTTP request
2. **API Service**: Centralized API functions handle requests
3. **Vercel Function**: Serverless function processes request
4. **Database Query**: MongoDB operation via Mongoose
5. **Response**: JSON data returned to frontend
6. **State Update**: React component updates UI with new data

### Example API Flow

```javascript
// Frontend (React Component)
const fetchExams = async () => {
  const response = await fetch('/api/exams');
  const data = await response.json();
  setExams(data.records);
};

// Backend (Vercel Function)
export default async function handler(req, res) {
  const exams = await Exam.find().sort({ name: 1 });
  res.json({ records: exams });
}
```

## File Upload System

### How File Uploads Work

1. **Frontend Upload**: User selects file in admin panel
2. **Size Validation**: Check file size (500KB limit)
3. **Type Validation**: Verify file type (images only)
4. **Local URL**: Create object URL for preview
5. **Form Submission**: Include file data in form
6. **Backend Processing**: Store file info in database

```javascript
// Frontend file upload
const uploadImage = async (file) => {
  if (file.size > 512000) {
    throw new Error('File size exceeds 500KB limit');
  }
  const localUrl = URL.createObjectURL(file);
  return localUrl;
};
```

## Deployment Architecture

### How Vercel Deployment Works

1. **Code Push**: Git push to GitHub repository
2. **Auto Deploy**: Vercel detects changes and builds
3. **Frontend Build**: Vite builds React app to static files
4. **Function Deploy**: API files become serverless functions
5. **CDN Distribution**: Static files served via Vercel CDN
6. **Domain Mapping**: Custom domain points to Vercel

### Environment Variables

```
MONGODB_URI=mongodb+srv://...     # Database connection
JWT_SECRET=your-secret-key        # Authentication secret
SUPABASE_URL=https://...          # Future integrations
```

## Key Features Implementation

### 1. Syllabus Management System

**How it works:**
- Admin uploads syllabus documents via admin panel
- Files stored with exam mapping in database
- Public users access syllabus from exam detail pages
- Download tracking for analytics

### 2. Blog System

**How it works:**
- Rich text editor for content creation
- Image upload with size validation
- SEO-friendly URLs with slugs
- Published/draft status management

### 3. Resource Organization

**How it works:**
- Hierarchical structure: Exams → Stages → Subjects → Resources
- Multiple resource types (PDFs, videos, links)
- Search and filter functionality
- Download tracking and analytics

### 4. Responsive Design

**How it works:**
- Tailwind CSS utility classes
- Mobile-first design approach
- Flexible grid layouts
- Touch-friendly interfaces

## Performance Optimizations

### Frontend Optimizations
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Compressed images and lazy loading
- **Caching**: Browser caching for static assets
- **Minification**: Compressed JavaScript and CSS

### Backend Optimizations
- **Database Indexing**: Optimized query performance
- **Connection Pooling**: Efficient database connections
- **Response Caching**: Cached API responses
- **Serverless Benefits**: Auto-scaling and cost efficiency

## Security Measures

### Authentication Security
- JWT tokens with expiration
- Secure token storage
- Protected admin routes
- Input validation and sanitization

### Data Security
- MongoDB connection encryption
- CORS configuration
- Rate limiting (future enhancement)
- File upload restrictions

## Error Handling

### Frontend Error Handling
- Try-catch blocks for API calls
- User-friendly error messages
- Loading states and feedback
- Form validation

### Backend Error Handling
- Comprehensive error catching
- Proper HTTP status codes
- Detailed error logging
- Graceful failure handling

## Future Enhancements

### Planned Improvements
1. **Cloud Storage**: AWS S3 integration for file storage
2. **Real-time Features**: WebSocket for live updates
3. **Advanced Analytics**: User behavior tracking
4. **Mobile App**: React Native implementation
5. **AI Integration**: Personalized recommendations

### Scalability Considerations
- Microservices architecture
- CDN integration
- Database sharding
- Load balancing

## Development Workflow

### Local Development
1. Clone repository
2. Install dependencies (`npm install`)
3. Set environment variables
4. Start development server (`npm run dev`)
5. Access at `http://localhost:5173`

### Production Deployment
1. Push code to GitHub
2. Vercel auto-deploys
3. Environment variables configured in Vercel dashboard
4. Database hosted on MongoDB Atlas
5. Domain configured for production access

This technical documentation provides a comprehensive understanding of how the CivilPath Study Platform works, from frontend components to backend APIs, database design, and deployment architecture.