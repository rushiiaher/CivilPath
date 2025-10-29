export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const mongoose = await import('mongoose');
    
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ error: 'MONGODB_URI not configured' });
    }

    // Connect to MongoDB
    if (mongoose.default.connection.readyState !== 1) {
      await mongoose.default.connect(process.env.MONGODB_URI);
    }

    // Define Resource schema inline
    const resourceSchema = new mongoose.default.Schema({
      exam_id: { type: String },
      stage_id: { type: String },
      subject_id: { type: String },
      resource_type_id: { type: String },
      title: { type: String, required: true },
      description: { type: String },
      file_path: { type: String },
      external_url: { type: String },
      file_type: { type: String },
      author: { type: String },
      year: { type: String },
      download_count: { type: Number, default: 0 }
    }, { timestamps: true });

    const Resource = mongoose.default.models.Resource || mongoose.default.model('Resource', resourceSchema);

    const { method, query } = req;

    if (method === 'GET') {
      const { id, exam_id } = query;
      
      if (id) {
        const resource = await Resource.findById(id);
        if (!resource) {
          return res.status(404).json({ error: 'Resource not found' });
        }
        return res.json(resource);
      }

      let queryFilter = {};
      if (exam_id) {
        queryFilter.exam_id = exam_id;
      }

      const resources = await Resource.find(queryFilter).sort({ createdAt: -1 });
      return res.json({ records: resources });
    }

    if (method === 'POST') {
      const { action } = query;
      
      // Handle download tracking
      if (action === 'download') {
        const { id } = query;
        const resource = await Resource.findById(id);
        if (resource) {
          resource.download_count = (resource.download_count || 0) + 1;
          await resource.save();
          return res.json({ message: 'Download tracked' });
        }
        return res.status(404).json({ error: 'Resource not found' });
      }
      
      // Regular resource creation
      const resource = new Resource(req.body);
      const savedResource = await resource.save();
      return res.status(201).json(savedResource);
    }

    if (method === 'PUT') {
      const { id } = query;
      const updatedResource = await Resource.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedResource) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      return res.json(updatedResource);
    }

    if (method === 'DELETE') {
      const { id } = query;
      const deletedResource = await Resource.findByIdAndDelete(id);
      if (!deletedResource) {
        return res.status(404).json({ error: 'Resource not found' });
      }
      return res.json({ message: 'Resource deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}