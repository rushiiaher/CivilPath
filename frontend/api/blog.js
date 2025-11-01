export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const mongoose = await import('mongoose');
    
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ error: 'MONGODB_URI not configured' });
    }

    if (mongoose.default.connection.readyState !== 1) {
      await mongoose.default.connect(process.env.MONGODB_URI);
    }

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

    // Only return published posts for public API
    const posts = await BlogPost.find({ status: 'published' }).sort({ createdAt: -1 });
    
    return res.json({ records: posts });
  } catch (error) {
    console.error('Blog API error:', error);
    return res.status(500).json({ error: error.message });
  }
}