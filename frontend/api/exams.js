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

    // Define Exam schema inline
    const examSchema = new mongoose.default.Schema({
      name: { type: String, required: true },
      slug: { type: String, required: true },
      description: { type: String },
      category: { type: String },
      status: { type: String, default: 'active' }
    }, { timestamps: true });

    const Exam = mongoose.default.models.Exam || mongoose.default.model('Exam', examSchema);

    const { method, query } = req;

    if (method === 'GET') {
      const { id } = query;
      
      if (id) {
        const exam = await Exam.findById(id);
        if (!exam) {
          return res.status(404).json({ error: 'Exam not found' });
        }
        return res.json(exam);
      }

      const exams = await Exam.find({ status: 'active' }).sort({ createdAt: -1 });
      return res.json({ records: exams });
    }

    if (method === 'POST') {
      const exam = new Exam(req.body);
      const savedExam = await exam.save();
      return res.status(201).json(savedExam);
    }

    if (method === 'PUT') {
      const { id } = query;
      const updatedExam = await Exam.findByIdAndUpdate(id, req.body, { new: true });
      return res.json(updatedExam);
    }

    if (method === 'DELETE') {
      const { id } = query;
      await Exam.findByIdAndDelete(id);
      return res.json({ message: 'Exam deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}