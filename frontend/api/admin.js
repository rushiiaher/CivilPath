export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { type } = req.query;

    // Return mock data based on type
    switch (type) {
      case 'exam-info':
        return res.json({ records: [] });
      
      case 'stages':
        return res.json({ records: [] });
      
      default:
        return res.json({ 
          message: 'Admin API working',
          availableTypes: ['exam-info', 'stages']
        });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}