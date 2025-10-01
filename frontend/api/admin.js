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
  const { type } = query; // exam-info, stages, subjects, uploads, resource-types

  try {
    // Public endpoints
    if (method === 'GET' && type === 'resource-types') {
      const { data, error } = await supabase
        .from('resource_types')
        .select('*')
        .eq('status', 'active')
        .order('name');
      if (error) throw error;
      return res.json({ records: data });
    }

    // Protected endpoints
    const user = authenticateToken(req);
    if (!user && method !== 'GET') {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Exam Info
    if (type === 'exam-info') {
      if (method === 'GET') {
        const { id, exam_id } = query;
        let queryBuilder = supabase
          .from('exam_info_sections')
          .select(`*, exams!inner(name)`)
          .order('order_index', { ascending: true });

        if (id) queryBuilder = queryBuilder.eq('id', id).single();
        else if (exam_id) queryBuilder = queryBuilder.eq('exam_id', exam_id);

        const { data, error } = await queryBuilder;
        if (error) throw error;

        if (id) return res.json(data);
        const records = data.map(item => ({ ...item, exam_name: item.exams?.name }));
        return res.json({ records });
      }

      if (method === 'POST') {
        const { data, error } = await supabase.from('exam_info_sections').insert([req.body]).select().single();
        if (error) throw error;
        return res.status(201).json(data);
      }

      if (method === 'PUT') {
        const { id } = query;
        const { data, error } = await supabase.from('exam_info_sections').update(req.body).eq('id', id).select().single();
        if (error) throw error;
        return res.json(data);
      }

      if (method === 'DELETE') {
        const { id } = query;
        const { error } = await supabase.from('exam_info_sections').delete().eq('id', id);
        if (error) throw error;
        return res.json({ message: 'Deleted successfully' });
      }
    }

    // Stages
    if (type === 'stages') {
      if (method === 'GET') {
        const { id, exam_id } = query;
        let queryBuilder = supabase
          .from('exam_stages')
          .select(`*, exams!inner(name)`)
          .order('order_index', { ascending: true });

        if (id) queryBuilder = queryBuilder.eq('id', id).single();
        else if (exam_id) queryBuilder = queryBuilder.eq('exam_id', exam_id);

        const { data, error } = await queryBuilder;
        if (error) throw error;

        if (id) return res.json(data);
        const records = data.map(item => ({ ...item, exam_name: item.exams?.name }));
        return res.json({ records });
      }

      if (method === 'POST') {
        const { data, error } = await supabase.from('exam_stages').insert([req.body]).select().single();
        if (error) throw error;
        return res.status(201).json(data);
      }
    }

    // Subjects
    if (type === 'subjects') {
      if (method === 'GET') {
        const { id, stage_id } = query;
        let queryBuilder = supabase
          .from('subjects')
          .select(`
            *,
            exam_stages!inner(
              name,
              exams!inner(name)
            )
          `)
          .order('order_index', { ascending: true });

        if (id) queryBuilder = queryBuilder.eq('id', id).single();
        else if (stage_id) queryBuilder = queryBuilder.eq('stage_id', stage_id);

        const { data, error } = await queryBuilder;
        if (error) throw error;

        if (id) return res.json(data);
        const records = data.map(item => ({ 
          ...item, 
          exam_name: item.exam_stages?.exams?.name,
          stage_name: item.exam_stages?.name 
        }));
        return res.json({ records });
      }

      if (method === 'POST') {
        const { data, error } = await supabase.from('subjects').insert([req.body]).select().single();
        if (error) throw error;
        return res.status(201).json(data);
      }

      if (method === 'PUT') {
        const { id } = query;
        const { data, error } = await supabase.from('subjects').update(req.body).eq('id', id).select().single();
        if (error) throw error;
        return res.json(data);
      }

      if (method === 'DELETE') {
        const { id } = query;
        const { error } = await supabase.from('subjects').delete().eq('id', id);
        if (error) throw error;
        return res.json({ message: 'Subject deleted successfully' });
      }
    }

    // Uploads
    if (type === 'uploads') {
      if (method === 'GET') {
        const { data, error } = await supabase
          .from('file_uploads')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return res.json({ records: data });
      }

      if (method === 'DELETE') {
        const { id } = query;
        const { error } = await supabase.from('file_uploads').delete().eq('id', id);
        if (error) throw error;
        return res.json({ message: 'File deleted successfully' });
      }
    }

    return res.status(404).json({ error: 'Endpoint not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}