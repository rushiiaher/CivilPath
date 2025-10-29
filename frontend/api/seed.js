import connectDB from '../lib/mongodb.js';
import Exam from '../models/Exam.js';
import BlogPost from '../models/BlogPost.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Sample exams
    const sampleExams = [
      {
        name: 'UPSC Civil Services',
        slug: 'upsc-civil-services',
        description: 'Union Public Service Commission Civil Services Examination',
        category: 'Central Government',
        status: 'active'
      },
      {
        name: 'MPSC Combined Services',
        slug: 'mpsc-combined-services',
        description: 'Maharashtra Public Service Commission Combined Services',
        category: 'State Government',
        status: 'active'
      }
    ];

    // Sample blog posts
    const samplePosts = [
      {
        title: 'How to Prepare for UPSC Civil Services',
        slug: 'how-to-prepare-upsc-civil-services',
        excerpt: 'Complete guide to UPSC preparation strategy',
        content: 'Detailed content about UPSC preparation...',
        author: 'Admin',
        status: 'published'
      }
    ];

    await Exam.insertMany(sampleExams);
    await BlogPost.insertMany(samplePosts);

    return res.json({ 
      message: 'Sample data seeded successfully',
      data: {
        exams: sampleExams.length,
        posts: samplePosts.length
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}