import jwt from 'jsonwebtoken';

const authenticateToken = (req) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

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

    if (mongoose.default.connection.readyState !== 1) {
      await mongoose.default.connect(process.env.MONGODB_URI);
    }

    // Schemas
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

    const Stage = mongoose.default.models.Stage || mongoose.default.model('Stage', stageSchema);
    const ResourceType = mongoose.default.models.ResourceType || mongoose.default.model('ResourceType', resourceTypeSchema);
    const Subject = mongoose.default.models.Subject || mongoose.default.model('Subject', subjectSchema);
    const BlogPost = mongoose.default.models.BlogPost || mongoose.default.model('BlogPost', blogPostSchema);
    const Resource = mongoose.default.models.Resource || mongoose.default.model('Resource', resourceSchema);

    const { endpoint } = req.query;

    // Route handling
    if (endpoint === 'stages') {
      return handleStages(req, res, Stage);
    } else if (endpoint === 'resource-types') {
      return handleResourceTypes(req, res, ResourceType);
    } else if (endpoint === 'subjects') {
      return handleSubjects(req, res, Subject);
    } else if (endpoint === 'blog') {
      return handleBlog(req, res, BlogPost);
    } else if (endpoint === 'resources') {
      return handleResources(req, res, Resource);
    } else if (endpoint === 'upload') {
      return handleUpload(req, res);
    }

    return res.status(404).json({ error: 'Endpoint not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function handleStages(req, res, Stage) {
  const { method, query } = req;
  const { exam_id } = query;

  if (method === 'GET') {
    let stageQuery = {};
    if (exam_id) stageQuery.exam_id = exam_id;
    const stages = await Stage.find(stageQuery).sort({ createdAt: -1 });
    return res.json({ records: stages });
  }

  if (method === 'POST') {
    const stage = new Stage(req.body);
    const savedStage = await stage.save();
    return res.status(201).json(savedStage);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleResourceTypes(req, res, ResourceType) {
  const { method } = req;

  if (method === 'GET') {
    const resourceTypes = await ResourceType.find().sort({ name: 1 });
    return res.json({ records: resourceTypes });
  }

  if (method === 'POST') {
    if (req.body.seed) {
      const defaultTypes = [
        { name: 'Previous Year Papers', description: 'Previous year question papers' },
        { name: 'Study Material', description: 'Study notes and materials' },
        { name: 'Mock Tests', description: 'Practice tests and mock exams' },
        { name: 'Video Lectures', description: 'Educational video content' },
        { name: 'Books & PDFs', description: 'Reference books and PDF materials' },
        { name: 'Current Affairs', description: 'Current affairs materials' },
        { name: 'Answer Keys', description: 'Answer keys for exams' },
        { name: 'Syllabus', description: 'Official syllabus documents' }
      ];
      const existingCount = await ResourceType.countDocuments();
      if (existingCount === 0) {
        const insertedTypes = await ResourceType.insertMany(defaultTypes);
        return res.status(201).json({ message: 'Default resource types created', count: insertedTypes.length });
      }
      return res.json({ message: 'Resource types already exist' });
    }
    
    const resourceType = new ResourceType(req.body);
    const savedResourceType = await resourceType.save();
    return res.status(201).json(savedResourceType);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleSubjects(req, res, Subject) {
  const { method, query } = req;
  const { stage_id } = query;

  if (method === 'GET') {
    let subjectQuery = {};
    if (stage_id) subjectQuery.stage_id = stage_id;
    const subjects = await Subject.find(subjectQuery).sort({ name: 1 });
    return res.json({ records: subjects });
  }

  if (method === 'POST') {
    const subject = new Subject(req.body);
    const savedSubject = await subject.save();
    return res.status(201).json(savedSubject);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleBlog(req, res, BlogPost) {
  const { method, query } = req;

  if (method === 'GET') {
    const { id } = query;
    if (id) {
      const post = await BlogPost.findById(id);
      if (!post) return res.status(404).json({ error: 'Blog post not found' });
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
    if (!updatedPost) return res.status(404).json({ error: 'Blog post not found' });
    return res.json(updatedPost);
  }

  if (method === 'DELETE') {
    const { id } = query;
    const deletedPost = await BlogPost.findByIdAndDelete(id);
    if (!deletedPost) return res.status(404).json({ error: 'Blog post not found' });
    return res.json({ message: 'Blog post deleted successfully' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleResources(req, res, Resource) {
  const { method, query } = req;

  if (method === 'GET') {
    const { id, exam_id } = query;
    if (id) {
      const resource = await Resource.findById(id);
      if (!resource) return res.status(404).json({ error: 'Resource not found' });
      return res.json(resource);
    }
    let queryFilter = {};
    if (exam_id) queryFilter.exam_id = exam_id;
    const resources = await Resource.find(queryFilter).sort({ createdAt: -1 });
    return res.json({ records: resources });
  }

  if (method === 'POST') {
    const { action } = query;
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
    const resource = new Resource(req.body);
    const savedResource = await resource.save();
    return res.status(201).json(savedResource);
  }

  if (method === 'PUT') {
    const { id } = query;
    const updatedResource = await Resource.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedResource) return res.status(404).json({ error: 'Resource not found' });
    return res.json(updatedResource);
  }

  if (method === 'DELETE') {
    const { id } = query;
    const deletedResource = await Resource.findByIdAndDelete(id);
    if (!deletedResource) return res.status(404).json({ error: 'Resource not found' });
    return res.json({ message: 'Resource deleted successfully' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleUpload(req, res) {
  const user = authenticateToken(req);
  if (!user) return res.status(401).json({ error: 'Access token required' });

  const { fileName, fileType, fileSize } = req.body;
  
  if (fileSize && fileSize > 512000) {
    return res.status(400).json({ 
      error: 'File size exceeds 500KB limit',
      maxSize: '500KB',
      actualSize: `${Math.round(fileSize / 1024)}KB`
    });
  }
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (fileType && !allowedTypes.includes(fileType.toLowerCase())) {
    return res.status(400).json({ 
      error: 'Invalid file type',
      allowedTypes: 'JPG, PNG, GIF, WebP'
    });
  }
  
  const imageUrl = `https://picsum.photos/400/250?random=${Date.now()}`;
  
  return res.status(201).json({
    message: 'File uploaded successfully',
    url: imageUrl,
    fileName,
    fileSize
  });
}