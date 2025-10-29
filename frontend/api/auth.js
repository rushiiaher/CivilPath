export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    // Simple hardcoded admin credentials for now
    if (username === 'admin' && password === 'admin123') {
      const jwt = await import('jsonwebtoken');
      
      const token = jwt.default.sign(
        { id: 'admin', username: 'admin' },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      );

      return res.json({ 
        token, 
        user: { id: 'admin', username: 'admin' }
      });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}