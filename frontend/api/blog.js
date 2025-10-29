import jwt from 'jsonwebtoken';
import connectDB from '../lib/mongodb.js';
import BlogPost from '../models/BlogPost.js';

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectDB();

  const { method, query } = req;

  try {
    if (method === 'GET') {
      const { id, category_id } = query;
      
      if (id) {
        const post = await BlogPost.findById(id);
        if (!post) {
          return res.status(404).json({ error: 'Blog post not found' });
        }
        return res.json({
          ...post.toObject(),
          category_name: 'General' // Default category name
        });
      }

      let queryBuilder = BlogPost.find({ status: 'published' })
        .sort({ createdAt: -1 });

      if (category_id) {
        queryBuilder = queryBuilder.where('category_id').equals(category_id);
      }

      const posts = await queryBuilder;
      
      const records = posts.map(post => ({
        ...post.toObject(),
        category_name: 'General' // Default category name
      }));

      return res.json({ records });
    }

    const user = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Access token required' });
    }

    if (method === 'POST') {
      const post = new BlogPost(req.body);
      const savedPost = await post.save();
      return res.status(201).json(savedPost);
    }

    if (method === 'PUT') {
      const { id } = query;
      const updatedPost = await BlogPost.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedPost) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      return res.json(updatedPost);
    }

    if (method === 'DELETE') {
      const { id } = query;
      const deletedPost = await BlogPost.findByIdAndDelete(id);
      if (!deletedPost) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      return res.json({ message: 'Blog post deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}