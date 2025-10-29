import jwt from 'jsonwebtoken';
import connectDB from '../lib/mongodb.js';
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
      const { id } = query;
      
      if (id) {
        const exam = await Exam.findById(id);
        if (!exam) {
          return res.status(404).json({ error: 'Exam not found' });
        }
        return res.json(exam);
      }

      const exams = await Exam.find({ status: 'active' }).sort({ createdAt: -1 });
      return res.json({ records: exams });
    }

    const user = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Access token required' });
    }

    if (method === 'POST') {
      const exam = new Exam(req.body);
      const savedExam = await exam.save();
      return res.status(201).json(savedExam);
    }

    if (method === 'PUT') {
      const { id } = query;
      const updatedExam = await Exam.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedExam) {
        return res.status(404).json({ error: 'Exam not found' });
      }
      return res.json(updatedExam);
    }

    if (method === 'DELETE') {
      const { id } = query;
      const deletedExam = await Exam.findByIdAndDelete(id);
      if (!deletedExam) {
        return res.status(404).json({ error: 'Exam not found' });
      }
      return res.json({ message: 'Exam deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}