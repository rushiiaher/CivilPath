import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  category: { type: String },
  image: { type: String },
  eligibility: { type: String },
  exam_pattern: { type: String },
  syllabus: { type: String },
  notification_url: { type: String },
  application_dates: { type: String },
  exam_dates: { type: String },
  status: { type: String, default: 'active' }
}, {
  timestamps: true
});

export default mongoose.models.Exam || mongoose.model('Exam', examSchema);