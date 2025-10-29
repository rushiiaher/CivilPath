export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const bcrypt = await import('bcryptjs');
    const mongoose = await import('mongoose');
    
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ error: 'MONGODB_URI not configured' });
    }

    // Connect to MongoDB
    if (mongoose.default.connection.readyState !== 1) {
      await mongoose.default.connect(process.env.MONGODB_URI);
    }

    // Define User schema inline
    const userSchema = new mongoose.default.Schema({
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      email: { type: String, required: true }
    }, { timestamps: true });

    const User = mongoose.default.models.User || mongoose.default.model('User', userSchema);

    const hashedPassword = await bcrypt.default.hash('admin123', 10);
    
    const user = new User({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@civilpath.com'
    });

    const savedUser = await user.save();
    return res.json({ 
      message: 'Admin user created successfully',
      user: { id: savedUser._id, username: savedUser.username }
    });

  } catch (error) {
    return res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
}