import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String },
  content: { type: String, required: true },
  author: { type: String, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogCategory' },
  featured_image: { type: String },
  read_time: { type: Number, default: 5 },
  status: { type: String, enum: ['draft', 'published'], default: 'published' }
}, {
  timestamps: true
});

export default mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);