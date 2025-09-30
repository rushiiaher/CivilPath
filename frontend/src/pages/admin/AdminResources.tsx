import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

interface Resource {
  id: string;
  exam_id: string;
  category_id: string;
  title: string;
  description: string;
  file_path: string;
  file_type: string;
  exam_name?: string;
  category_name?: string;
}

export default function AdminResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    exam_id: '',
    category_id: '',
    file_type: 'pdf'
  });

  const token = localStorage.getItem('adminToken');

  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
      const response = await fetch(`/api${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers
        }
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const data = await apiRequest('/resources');
      setResources(data.records || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/resources', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      fetchResources();
      setShowForm(false);
      setFormData({ title: '', description: '', exam_id: '', category_id: '', file_type: 'pdf' });
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };

  if (loading) return <AdminLayout title="Resources"><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="Resources">
      <div className="mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Resource
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Resource</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">File Type</label>
              <select
                value={formData.file_type}
                onChange={(e) => setFormData({...formData, file_type: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="pdf">PDF</option>
                <option value="doc">Document</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                rows={3}
              />
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Exam</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">File Type</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id} className="border-t">
                <td className="px-4 py-2">{resource.title}</td>
                <td className="px-4 py-2">{resource.exam_name || 'N/A'}</td>
                <td className="px-4 py-2">{resource.category_name || 'N/A'}</td>
                <td className="px-4 py-2">{resource.file_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}