# MongoDB Atlas Migration Guide

## 1. Setup MongoDB Atlas

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create Cluster**: 
   - Choose free tier (M0)
   - Select region closest to your users
   - Name your cluster (e.g., "civilpath-cluster")

3. **Create Database User**:
   - Go to Database Access
   - Add new user with username/password
   - Give "Read and write to any database" permissions

4. **Whitelist IP**:
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (allow from anywhere)

5. **Get Connection String**:
   - Go to Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `civilpath`

## 2. Update Vercel Environment Variables

Remove old Supabase variables and add:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/civilpath?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
```

## 3. What's Changed

### Backend:
- ✅ Replaced Supabase with MongoDB/Mongoose
- ✅ Created data models (User, Exam, Resource, BlogPost, ResourceCategory)
- ✅ Updated auth API to use MongoDB
- ✅ Updated exams API to use MongoDB
- 🔄 Need to update: resources, blog, categories APIs

### Database Schema:
- `admin_users` → `users` collection
- `exams` → `exams` collection  
- `resources` → `resources` collection
- `blog_posts` → `blogposts` collection
- `resource_categories` → `resourcecategories` collection

## 4. Next Steps

1. Set up MongoDB Atlas cluster
2. Update environment variables in Vercel
3. Complete remaining API conversions
4. Test all functionality
5. Create admin user: POST `/api/auth/create-admin`

## 5. Benefits of MongoDB

- ✅ No SQL query limits
- ✅ Better performance for document-based data
- ✅ Flexible schema
- ✅ Free tier with 512MB storage
- ✅ Built-in aggregation pipeline
- ✅ Better for complex nested data structures