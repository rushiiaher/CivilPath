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
      const { id, category_id } = query;
      
      if (id) {
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            *,
            blog_categories(name)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return res.json({
          ...data,
          category_name: data.blog_categories?.name
        });
      }

      let queryBuilder = supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories(name)
        `)
        .order('created_at', { ascending: false });

      // Only show published posts for non-authenticated users
      const user = authenticateToken(req);
      if (!user) {
        queryBuilder = queryBuilder.eq('status', 'published');
      }

      if (category_id) {
        queryBuilder = queryBuilder.eq('category_id', category_id);
      }

      const { data, error } = await queryBuilder;
      if (error) throw error;
      
      const records = data.map(post => ({
        ...post,
        category_name: post.blog_categories?.name,
        images: post.images || []
      }));

      return res.json({ records });
    }

    const user = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Access token required' });
    }

    if (method === 'POST') {
      const postData = { ...req.body };
      
      // Convert category_id if it's a number string to actual UUID
      if (postData.category_id && !postData.category_id.includes('-')) {
        const categoryMap = {
          '1': (await supabase.from('blog_categories').select('id').eq('slug', 'current-affairs').single()).data?.id,
          '2': (await supabase.from('blog_categories').select('id').eq('slug', 'study-tips').single()).data?.id,
          '3': (await supabase.from('blog_categories').select('id').eq('slug', 'exam-updates').single()).data?.id,
          '4': (await supabase.from('blog_categories').select('id').eq('slug', 'success-stories').single()).data?.id,
          '5': (await supabase.from('blog_categories').select('id').eq('slug', 'general-knowledge').single()).data?.id,
          '6': (await supabase.from('blog_categories').select('id').eq('slug', 'interview-preparation').single()).data?.id
        };
        postData.category_id = categoryMap[postData.category_id] || null;
      }
      
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([postData])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    if (method === 'PUT') {
      const { id } = query;
      const { data, error } = await supabase
        .from('blog_posts')
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
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.json({ message: 'Blog post deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}