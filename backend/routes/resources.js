const express = require('express');
const { supabase } = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all resources or by exam_id
router.get('/', async (req, res) => {
  try {
    const { id, exam_id } = req.query;
    
    if (id) {
      const { data, error } = await supabase
        .from('resources')
        .select(`
          *,
          exams(name),
          resource_categories(name)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return res.json(data);
    }

    let query = supabase
      .from('resources')
      .select(`
        *,
        exams(name),
        resource_categories(name)
      `)
      .order('created_at', { ascending: false });

    if (exam_id) {
      query = query.eq('exam_id', exam_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    const records = data.map(resource => ({
      ...resource,
      exam_name: resource.exams?.name,
      category_name: resource.resource_categories?.name
    }));

    res.json({ records });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create resource (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('resources')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update resource (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('resources')
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

// Delete resource (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;