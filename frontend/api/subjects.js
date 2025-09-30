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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method, query } = req;

  try {
    if (method === 'GET') {
      const { id, stage_id } = query;
      
      let queryBuilder = supabase
        .from('subjects')
        .select(`
          *,
          exams!inner(name),
          exam_stages!inner(name)
        `)
        .order('order_index', { ascending: true });

      if (id) {
        queryBuilder = queryBuilder.eq('id', id).single();
      } else if (stage_id) {
        queryBuilder = queryBuilder.eq('stage_id', stage_id);
      }

      const { data, error } = await queryBuilder;
      
      if (error) throw error;

      if (id) {
        return res.json(data);
      }

      const records = data.map(item => ({
        ...item,
        exam_name: item.exams?.name,
        stage_name: item.exam_stages?.name
      }));

      return res.json({ records });
    }

    const user = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Access token required' });
    }

    if (method === 'POST') {
      const { data, error } = await supabase
        .from('subjects')
        .insert([req.body])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    if (method === 'PUT') {
      const { id } = query;
      const { data, error } = await supabase
        .from('subjects')
        .update(req.body)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.json(data);
    }

    if (method === 'DELETE') {
      const { id } = query;
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.json({ message: 'Subject deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}