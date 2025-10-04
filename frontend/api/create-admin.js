import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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

    res.json({ message: 'Admin user created', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}