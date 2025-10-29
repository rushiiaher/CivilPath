import jwt from 'jsonwebtoken';
import connectDB from '../lib/mongodb.js';
import Resource from '../models/Resource.js';
import Exam from '../models/Exam.js';
import ResourceCategory from '../models/ResourceCategory.js';

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
        const resource = await Resource.findById(id)
          .populate('exam_id', 'name')
          .populate('category_id', 'name');
        
        if (!resource) {
          return res.status(404).json({ error: 'Resource not found' });
        }
        return res.json(resource);
      }

      let queryBuilder = Resource.find()
        .populate('exam_id', 'name')
        .populate('category_id', 'name')
        .sort({ createdAt: -1 });

      if (exam_id) {
        queryBuilder = queryBuilder.where('exam_id').equals(exam_id);
      }

      const resources = await queryBuilder;
      
      const records = resources.map(resource => ({
        ...resource.toObject(),
        exam_name: resource.exam_id?.name,
        category_name: resource.category_id?.name
      }));

      return res.json({ records });
    }

    const user = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Access token required' });
    }

    if (method === 'POST') {
      const resource = new Resource(req.body);
      const savedResource = await resource.save();
      return res.status(201).json(savedResource);
    }

    if (method === 'PUT') {
      const { id } = query;
      const updatedResource = await Resource.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedResource) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      return res.json(updatedResource);
    }

    if (method === 'DELETE') {
      const { id } = query;
      const deletedResource = await Resource.findByIdAndDelete(id);
      if (!deletedResource) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      return res.json({ message: 'Resource deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}