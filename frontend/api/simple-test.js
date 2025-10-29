export default async function handler(req, res) {
  try {
    return res.json({ 
      message: 'Simple test working',
      method: req.method,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}