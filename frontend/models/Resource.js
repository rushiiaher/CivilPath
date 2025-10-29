import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  exam_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ResourceCategory' },
  title: { type: String, required: true },
  description: { type: String },
  file_path: { type: String },
  file_type: { type: String },
  tags: [{ type: String }],
  year: { type: String },
  download_count: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.models.Resource || mongoose.model('Resource', resourceSchema);