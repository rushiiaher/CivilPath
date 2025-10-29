export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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

    const resourceTypeSchema = new mongoose.default.Schema({
      name: { type: String, required: true },
      description: { type: String }
    }, { timestamps: true });

    const ResourceType = mongoose.default.models.ResourceType || mongoose.default.model('ResourceType', resourceTypeSchema);

    const defaultResourceTypes = [
      { name: 'Previous Year Papers', description: 'Previous year question papers' },
      { name: 'Study Material', description: 'Study notes and materials' },
      { name: 'Mock Tests', description: 'Practice tests and mock exams' },
      { name: 'Video Lectures', description: 'Educational video content' },
      { name: 'Books & PDFs', description: 'Reference books and PDF materials' },
      { name: 'Current Affairs', description: 'Current affairs materials' },
      { name: 'Answer Keys', description: 'Answer keys for exams' },
      { name: 'Syllabus', description: 'Official syllabus documents' }
    ];

    // Check if resource types already exist
    const existingCount = await ResourceType.countDocuments();
    if (existingCount > 0) {
      return res.json({ message: 'Resource types already exist', count: existingCount });
    }

    // Insert default resource types
    const insertedTypes = await ResourceType.insertMany(defaultResourceTypes);
    
    return res.status(201).json({ 
      message: 'Default resource types created successfully',
      count: insertedTypes.length,
      types: insertedTypes
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}