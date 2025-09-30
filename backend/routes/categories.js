const express = require('express');
const { supabase } = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all resource categories or by exam_id
router.get('/', async (req, res) => {
  try {
    const { id, exam_id } = req.query;
    
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

    let query = supabase
      .from('resource_categories')
      .select(`
        *,
        exams(name)
      `)
      .order('created_at', { ascending: false });

    if (exam_id) {
      query = query.eq('exam_id', exam_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    const records = data.map(category => ({
      ...category,
      exam_name: category.exams?.name
    }));

    res.json({ records });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create resource category (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('resource_categories')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update resource category (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('resource_categories')
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

// Delete resource category (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('resource_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Resource category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;