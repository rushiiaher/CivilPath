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
          category_name: data.blog_categories?.name,
          images: data.images || [],
          read_time: data.read_time || 5
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
      
      const records = data.map(post => {
        console.log('Blog post images:', post.images);
        return {
          ...post,
          category_name: post.blog_categories?.name,
          images: post.images || [],
          read_time: post.read_time || 5
        };
      });

      return res.json({ records });
    }

    const user = authenticateToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Access token required' });
    }

    if (method === 'POST') {
      const { title, excerpt, content, author, status, featured_image, images } = req.body;
      
      const postData = {
        title: title || 'Untitled',
        slug: (title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now(),
        excerpt: excerpt || '',
        content: content || '',
        author: author || 'Admin',
        status: status || 'published',
        featured_image: featured_image || null,
        images: Array.isArray(images) ? images : [],
        category_id: null,
        read_time: 5
      };
      
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([postData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }
      return res.status(201).json(data);
    }

    if (method === 'PUT') {
      const { id } = query;
      const postData = { ...req.body };
      
      // Set category_id to null if it's a number string
      if (postData.category_id && !postData.category_id.includes('-')) {
        postData.category_id = null;
      }
      
      // Ensure images is properly formatted as array
      if (!postData.images || !Array.isArray(postData.images)) {
        postData.images = [];
      }
      
      const { data, error } = await supabase
        .from('blog_posts')
        .update(postData)
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