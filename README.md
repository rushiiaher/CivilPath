# Civil Path Study - Complete Backend System

A comprehensive civil services preparation platform with PHP backend, MySQL database, and React frontend.

## Features

### Admin Panel Features
- **Exam Management**: Add, edit, delete exams with categories
- **Resource Categories**: Manage resource types (Prelims, Mains, Optional, Test Series, Current Affairs, Coaching Material, E-books)
- **Resource Management**: Upload and manage study materials, PDFs, books
- **Blog Management**: Create, edit, publish blog posts with categories
- **Dashboard**: Overview of all content with statistics

### Frontend Features
- **Dynamic Content**: All content loaded from database via API
- **Exam Browsing**: Search and filter exams by category
- **Resource Access**: Download study materials by exam and category
- **Blog Section**: Read articles with category filtering
- **Responsive Design**: Mobile-friendly interface

## Setup Instructions

### 1. Database Setup

1. Start XAMPP and ensure MySQL is running
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Import the database schema:
   ```sql
   -- Run the contents of database/schema.sql
   ```
4. Import sample data:
   ```sql
   -- Run the contents of database/sample_data.sql
   ```

### 2. Backend Configuration

1. Update database credentials in `backend/config/database.php` if needed:
   ```php
   private $host = 'localhost';
   private $db_name = 'civilpath_study';
   private $username = 'root';
   private $password = '';
   ```

2. Ensure the uploads directory has write permissions:
   ```
   backend/uploads/
   ```

### 3. Admin Panel Access

1. Open: `http://localhost/civilpath-study/backend/admin/`
2. Default admin credentials:
   - Username: admin
   - Password: admin123

### 4. Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Frontend will be available at: `http://localhost:5173`

## API Endpoints

### Exams
- `GET /backend/api/exams.php` - Get all exams
- `GET /backend/api/exams.php?id={id}` - Get single exam
- `POST /backend/api/exams.php` - Create exam
- `PUT /backend/api/exams.php` - Update exam
- `DELETE /backend/api/exams.php` - Delete exam

### Resources
- `GET /backend/api/resources.php` - Get all resources
- `GET /backend/api/resources.php?exam_id={id}` - Get resources by exam
- `POST /backend/api/resources.php` - Create resource
- `PUT /backend/api/resources.php` - Update resource
- `DELETE /backend/api/resources.php` - Delete resource

### Blog Posts
- `GET /backend/api/blog.php` - Get all blog posts
- `GET /backend/api/blog.php?id={id}` - Get single blog post
- `GET /backend/api/blog.php?category_id={id}` - Get posts by category
- `POST /backend/api/blog.php` - Create blog post
- `PUT /backend/api/blog.php` - Update blog post
- `DELETE /backend/api/blog.php` - Delete blog post

### Categories
- `GET /backend/api/categories.php` - Get all resource categories
- `POST /backend/api/categories.php` - Create category
- `PUT /backend/api/categories.php` - Update category
- `DELETE /backend/api/categories.php` - Delete category

### File Upload
- `POST /backend/api/upload.php` - Upload files (PDF, images)

## Database Schema

### Tables
- `admin_users` - Admin authentication
- `exams` - Examination information
- `resource_categories` - Resource type categories
- `resources` - Study materials and files
- `blog_categories` - Blog post categories
- `blog_posts` - Blog articles

### Sample Data Included
- 5 Exams (UPSC, MPSC variants)
- 7 Resource categories
- Sample resources for each exam
- 6 Blog posts with content
- Blog categories

## File Structure

```
civilpath-study/
├── backend/
│   ├── admin/
│   │   ├── index.php (Admin panel interface)
│   │   └── admin.js (Admin panel JavaScript)
│   ├── api/
│   │   ├── exams.php
│   │   ├── resources.php
│   │   ├── blog.php
│   │   ├── categories.php
│   │   └── upload.php
│   ├── config/
│   │   ├── database.php
│   │   └── cors.php
│   ├── models/
│   │   ├── Exam.php
│   │   ├── Resource.php
│   │   ├── BlogPost.php
│   │   └── ResourceCategory.php
│   └── uploads/ (File storage)
├── database/
│   ├── schema.sql
│   └── sample_data.sql
├── frontend/
│   └── src/
│       ├── services/
│       │   └── api.ts (API service)
│       └── pages/ (Updated to use API)
└── README.md
```

## Usage

### Admin Operations

1. **Add New Exam**:
   - Go to Admin Panel → Exams
   - Click "Add New Exam"
   - Fill in exam details
   - Save

2. **Upload Resources**:
   - Go to Admin Panel → Resources
   - Click "Add New Resource"
   - Select exam and category
   - Upload file and add details

3. **Create Blog Posts**:
   - Go to Admin Panel → Blog Posts
   - Click "Add New Post"
   - Write content with HTML formatting
   - Set category and publish

### Frontend Features

1. **Dynamic Exam Listing**: All exams loaded from database
2. **Resource Filtering**: Filter by exam and category
3. **Blog Categories**: Filter blog posts by category
4. **Search Functionality**: Search exams and content
5. **Download Tracking**: Track resource downloads

## Security Features

- CORS headers for API access
- File type validation for uploads
- SQL injection prevention with PDO
- Input sanitization
- Admin authentication

## Customization

1. **Add New Resource Categories**: Use admin panel or directly in database
2. **Modify Exam Categories**: Update in admin panel
3. **Custom File Types**: Modify allowed types in upload.php
4. **Styling**: Update frontend CSS/Tailwind classes
5. **API Extensions**: Add new endpoints following existing pattern

The system is now fully functional with complete CRUD operations for all entities through the admin panel, and the frontend dynamically loads all content from the database.