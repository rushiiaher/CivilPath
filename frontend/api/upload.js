import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = authenticateToken(req);
  if (!user) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    // For now, just create a mock upload record
    const fileName = `file-${Date.now()}.pdf`;
    const filePath = `/uploads/${fileName}`;

    const { data, error } = await supabase
      .from('file_uploads')
      .insert([{
        original_name: 'sample-file.pdf',
        file_name: fileName,
        file_path: filePath,
        file_size: 1024000,
        mime_type: 'application/pdf',
        uploaded_by: user.id
      }])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      message: 'File uploaded successfully',
      file: data
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}