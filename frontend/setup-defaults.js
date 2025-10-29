// Setup script to initialize default data
const setupDefaults = async () => {
  try {
    console.log('Setting up default resource types...');
    
    const response = await fetch('/api/seed-resource-types', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    console.log('Resource types setup:', result);
    
  } catch (error) {
    console.error('Setup failed:', error);
  }
};

// Run setup if this file is executed directly
if (typeof window !== 'undefined') {
  setupDefaults();
}

export default setupDefaults;