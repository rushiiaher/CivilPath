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

    // Define schemas
    const stageSchema = new mongoose.default.Schema({
      exam_id: { type: String, required: true },
      name: { type: String, required: true },
      slug: { type: String, required: true },
      description: { type: String }
    }, { timestamps: true });

    const resourceTypeSchema = new mongoose.default.Schema({
      name: { type: String, required: true },
      description: { type: String }
    }, { timestamps: true });

    const subjectSchema = new mongoose.default.Schema({
      stage_id: { type: String, required: true },
      name: { type: String, required: true },
      description: { type: String }
    }, { timestamps: true });

    const Stage = mongoose.default.models.Stage || mongoose.default.model('Stage', stageSchema);
    const ResourceType = mongoose.default.models.ResourceType || mongoose.default.model('ResourceType', resourceTypeSchema);
    const Subject = mongoose.default.models.Subject || mongoose.default.model('Subject', subjectSchema);

    const { type, exam_id, stage_id } = req.query;
    const { method } = req;

    if (method === 'GET') {
      switch (type) {
        case 'stages':
          let stageQuery = {};
          if (exam_id) stageQuery.exam_id = exam_id;
          
          const stages = await Stage.find(stageQuery).sort({ createdAt: -1 });
          // Add exam names by looking up exams
          const stagesWithExamNames = await Promise.all(stages.map(async (stage) => {
            try {
              const examResponse = await fetch(`${req.headers.host ? 'http://' + req.headers.host : ''}/api/exams?id=${stage.exam_id}`);
              const examData = await examResponse.json();
              return {
                ...stage.toObject(),
                exam_name: examData.name || 'Unknown Exam'
              };
            } catch {
              return {
                ...stage.toObject(),
                exam_name: 'Unknown Exam'
              };
            }
          }));
          return res.json({ records: stagesWithExamNames });
        
        case 'resource-types':
          const resourceTypes = await ResourceType.find().sort({ name: 1 });
          return res.json({ records: resourceTypes });
        
        case 'subjects':
          let subjectQuery = {};
          if (stage_id) subjectQuery.stage_id = stage_id;
          const subjects = await Subject.find(subjectQuery).sort({ name: 1 });
          return res.json({ records: subjects });
        
        case 'exam-info':
          return res.json({ records: [] });
        
        default:
          return res.json({ 
            message: 'Admin API working',
            availableTypes: ['exam-info', 'stages', 'resource-types', 'subjects']
          });
      }
    }

    if (method === 'POST') {
      switch (type) {
        case 'stages':
          const stage = new Stage(req.body);
          const savedStage = await stage.save();
          return res.status(201).json(savedStage);
        
        case 'resource-types':
          const resourceType = new ResourceType(req.body);
          const savedResourceType = await resourceType.save();
          return res.status(201).json(savedResourceType);
        
        case 'subjects':
          const subject = new Subject(req.body);
          const savedSubject = await subject.save();
          return res.status(201).json(savedSubject);
        
        default:
          return res.status(400).json({ error: 'Invalid type for POST request' });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}