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

    // Define BlogPost schema inline
    const blogPostSchema = new mongoose.default.Schema({
      title: { type: String, required: true },
      slug: { type: String, required: true },
      excerpt: { type: String },
      content: { type: String, required: true },
      author: { type: String, required: true },
      category_id: { type: String },
      featured_image: { type: String },
      images: [{ type: String }],
      read_time: { type: Number, default: 5 },
      published_at: { type: Date },
      status: { type: String, enum: ['draft', 'published'], default: 'published' }
    }, { timestamps: true });

    const BlogPost = mongoose.default.models.BlogPost || mongoose.default.model('BlogPost', blogPostSchema);

    const { method, query } = req;

    if (method === 'GET') {
      const { id } = query;
      
      if (id) {
        const post = await BlogPost.findById(id);
        if (!post) {
          return res.status(404).json({ error: 'Blog post not found' });
        }
        return res.json(post);
      }

      const posts = await BlogPost.find({ status: 'published' }).sort({ createdAt: -1 });
      return res.json({ records: posts });
    }

    if (method === 'POST') {
      const post = new BlogPost(req.body);
      const savedPost = await post.save();
      return res.status(201).json(savedPost);
    }

    if (method === 'PUT') {
      const { id } = query;
      const updatedPost = await BlogPost.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedPost) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      return res.json(updatedPost);
    }

    if (method === 'DELETE') {
      const { id } = query;
      const deletedPost = await BlogPost.findByIdAndDelete(id);
      if (!deletedPost) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      return res.json({ message: 'Blog post deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}