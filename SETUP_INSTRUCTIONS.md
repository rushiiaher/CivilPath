# Quick Setup Instructions

## 🚨 IMPORTANT: Database Update Required

The structure has been improved. You need to update your database:

### 1. Backup Current Data (if any)
```sql
-- Export your current data if you have any
```

### 2. Update Database Schema
```sql
-- Drop existing tables (if you want fresh start)
DROP DATABASE IF EXISTS civilpath_study;

-- Run the updated schema
-- Import: database/schema.sql
-- Import: database/sample_data.sql
```

### 3. Access Points

**Admin Panel**: `http://localhost/civilpath-study/backend/admin/login.php`
- Username: `admin`
- Password: `admin123`

**Frontend**: `http://localhost:8080` (or your React dev server port)

**API Base**: `http://localhost/civilpath-study/backend/api/`

### 4. Test API Connection

Open browser console on frontend and check for API logs. If you see CORS errors:

1. Make sure XAMPP Apache is running
2. Check if the API URLs are accessible directly:
   - `http://localhost/civilpath-study/backend/api/exams.php`
   - `http://localhost/civilpath-study/backend/api/categories.php`

### 5. Key Improvements Made

✅ **Exam-Specific Resource Categories**: Each exam now has its own categories
✅ **Enhanced Exam Details**: Added eligibility, pattern, syllabus, dates
✅ **Better Admin Panel**: More detailed forms and management
✅ **API Debugging**: Added console logs to track API calls
✅ **Proper Structure**: Categories are now linked to specific exams

### 6. Admin Panel Features

- **Dashboard**: Overview statistics
- **Exams**: Full CRUD with detailed information
- **Categories**: Exam-specific resource categories
- **Resources**: Link resources to specific exam categories
- **Blog Posts**: Content management

### 7. If Frontend Still Shows Old Data

1. Clear browser cache
2. Check browser console for API errors
3. Verify XAMPP is running on port 80
4. Test API endpoints directly in browser

The system is now properly structured with exam-specific categories and enhanced functionality!