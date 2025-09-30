import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method } = req;
  const path = req.url.split('?')[0];

  try {
    if (method === 'POST' && path === '/api/auth/create-admin') {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const { data, error } = await supabase
        .from('admin_users')
        .insert([{
          username: 'admin',
          password: hashedPassword,
          email: 'admin@civilpath.com'
        }])
        .select();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.json({ message: 'Admin user created', data });
    }

    if (method === 'POST' && path === '/api/auth/login') {
      const { username, password } = req.body;

      const { data: admin, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .single();

      if (error || !admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: admin.id, username: admin.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({ token, user: { id: admin.id, username: admin.username } });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}