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

  const token = localStorage.getItem('adminToken');

  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });
    return response.json();
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

  if (loading) return <AdminLayout title="Resources"><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="Resources">
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