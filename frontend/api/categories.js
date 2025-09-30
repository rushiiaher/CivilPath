const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

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
      const { id, exam_id } = query;
      
      if (id) {
        const { data, error } = await supabase
          .from('resource_categories')
          .select(`
            *,
            exams(name)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return res.json({
          ...data,
          exam_name: data.exams?.name
        });
      }

      let queryBuilder = supabase
        .from('resource_categories')
        .select(`
          *,
          exams(name)
        `)
        .order('created_at', { ascending: false });

      if (exam_id) {
        queryBuilder = queryBuilder.eq('exam_id', exam_id);
      }

      const { data, error } = await queryBuilder;
      if (error) throw error;
      
      const records = data.map(category => ({
        ...category,
        exam_name: category.exams?.name
      }));

      return res.json({ records });
    }

    const user = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Access token required' });
    }

    if (method === 'POST') {
      const { data, error } = await supabase
        .from('resource_categories')
        .insert([req.body])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    if (method === 'PUT') {
      const { id } = query;
      const { data, error } = await supabase
        .from('resource_categories')
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
        .from('resource_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.json({ message: 'Resource category deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}