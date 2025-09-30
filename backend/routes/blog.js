const express = require('express');
const { supabase } = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all blog posts or by category_id
router.get('/', async (req, res) => {
  try {
    const { id, category_id } = req.query;
    
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

    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        blog_categories(name)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    const records = data.map(post => ({
      ...post,
      category_name: post.blog_categories?.name
    }));

    res.json({ records });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create blog post (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update blog post (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('blog_posts')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete blog post (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;