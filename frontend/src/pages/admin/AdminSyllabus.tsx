import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

interface Exam {
  id: string;
  name: string;
}

interface SyllabusResource {
  id: string;
  exam_id: string;
  title: string;
  description: string;
  file_path: string;
  external_url: string;
  exam_name?: string;
}

export default function AdminSyllabus() {
  const [syllabusResources, setSyllabusResources] = useState<SyllabusResource[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    exam_id: '',
    title: '',
    description: '',
    external_url: ''
  });

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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resourcesData, examsData] = await Promise.all([
        fetch('/api/admin-all?endpoint=resources').then(r => r.json()),
        fetch('/api/exams').then(r => r.json())
      ]);
      
      // Filter only syllabus resources
      const syllabusOnly = resourcesData.records?.filter((r: any) => r.resource_type_name === 'Syllabus') || [];
      setSyllabusResources(syllabusOnly);
      setExams(examsData.records || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Get syllabus resource type ID
      const resourceTypesData = await fetch('/api/admin-all?endpoint=resource-types').then(r => r.json());
      const syllabusType = resourceTypesData.records?.find((rt: any) => rt.slug === 'syllabus');
      
      if (!syllabusType) {
        alert('Syllabus resource type not found');
        return;
      }

      const dataToSend = {
        ...formData,
        resource_type_id: syllabusType.id,
        stage_id: null, // Syllabus is exam-level, not stage-specific
        subject_id: null
      };
      
      await fetch('/api/admin-all?endpoint=resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(dataToSend)
      });
      
      fetchData();
      setShowForm(false);
      setFormData({ exam_id: '', title: '', description: '', external_url: '' });
    } catch (error) {
      console.error('Error saving syllabus:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this syllabus?')) {
      try {
        await fetch(`/api/admin-all?endpoint=resources&id=${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting syllabus:', error);
      }
    }
  };

  return (
    <AdminLayout title="Syllabus Management">
      <div className="mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Syllabus Resource
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Add Syllabus Resource</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Exam *</label>
              <select
                value={formData.exam_id}
                onChange={(e) => setFormData({...formData, exam_id: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Select Exam</option>
                {exams.map(exam => (
                  <option key={exam._id || exam.id} value={exam._id || exam.id}>{exam.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                placeholder="e.g., Complete Syllabus PDF, Detailed Syllabus"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                rows={3}
                placeholder="Brief description of the syllabus resource"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Download URL *</label>
              <input
                type="url"
                value={formData.external_url}
                onChange={(e) => setFormData({...formData, external_url: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                placeholder="https://example.com/syllabus.pdf"
                required
              />
            </div>

            <div>
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
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Exam</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {syllabusResources.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No syllabus resources found
                  </td>
                </tr>
              ) : (
                syllabusResources.map((resource) => (
                  <tr key={resource.id} className="border-t">
                    <td className="px-4 py-2 font-medium">{resource.title}</td>
                    <td className="px-4 py-2">{resource.exam_name}</td>
                    <td className="px-4 py-2">{resource.description}</td>
                    <td className="px-4 py-2">
                      <a
                        href={resource.external_url || resource.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 mr-2 hover:underline"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleDelete(resource._id || resource.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}