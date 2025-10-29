import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '../lib/mongodb.js';
import User from '../models/User.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await connectDB();

  const { method } = req;
  const path = req.url.split('?')[0];

  try {
    if (method === 'POST' && (path === '/api/auth/create-admin' || (path === '/api/auth' && req.body.action === 'create-admin'))) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const user = new User({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@civilpath.com'
      });

      const savedUser = await user.save();
      return res.json({ message: 'Admin user created', data: savedUser });
    }

    if (method === 'POST' && (path === '/api/auth/login' || path === '/api/auth')) {
      const { username, password } = req.body;

      const admin = await User.findOne({ username });
      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: admin._id, username: admin.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({ token, user: { id: admin._id, username: admin.username } });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}