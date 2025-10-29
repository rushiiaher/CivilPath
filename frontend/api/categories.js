import jwt from 'jsonwebtoken';
import connectDB from '../lib/mongodb.js';
import ResourceCategory from '../models/ResourceCategory.js';
import Exam from '../models/Exam.js';

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
      const { id, exam_id } = query;
      
      if (id) {
        const category = await ResourceCategory.findById(id)
          .populate('exam_id', 'name');
        
        if (!category) {
          return res.status(404).json({ error: 'Category not found' });
        }
        return res.json({
          ...category.toObject(),
          exam_name: category.exam_id?.name
        });
      }

      let queryBuilder = ResourceCategory.find({ status: 'active' })
        .populate('exam_id', 'name')
        .sort({ createdAt: -1 });

      if (exam_id) {
        queryBuilder = queryBuilder.where('exam_id').equals(exam_id);
      }

      const categories = await queryBuilder;
      
      const records = categories.map(category => ({
        ...category.toObject(),
        exam_name: category.exam_id?.name
      }));

      return res.json({ records });
    }

    const user = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Access token required' });
    }

    if (method === 'POST') {
      const category = new ResourceCategory(req.body);
      const savedCategory = await category.save();
      return res.status(201).json(savedCategory);
    }

    if (method === 'PUT') {
      const { id } = query;
      const updatedCategory = await ResourceCategory.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
      return res.json(updatedCategory);
    }

    if (method === 'DELETE') {
      const { id } = query;
      const deletedCategory = await ResourceCategory.findByIdAndDelete(id);
      if (!deletedCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
      return res.json({ message: 'Resource category deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}