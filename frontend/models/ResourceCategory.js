import mongoose from 'mongoose';

const resourceCategorySchema = new mongoose.Schema({
  exam_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: 'active' }
}, {
  timestamps: true
});

export default mongoose.models.ResourceCategory || mongoose.model('ResourceCategory', resourceCategorySchema);