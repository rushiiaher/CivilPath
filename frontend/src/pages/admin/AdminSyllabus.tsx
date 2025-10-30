import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

interface Exam {
  id: string;
  name: string;
}

interface SyllabusResource {
  _id?: string;
  id?: string;
  exam_id: string;
  title: string;
  description: string;
  file_path?: string;
  external_url: string;
  exam_name?: string;
  resource_type_id?: string;
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
  const [editingResource, setEditingResource] = useState<SyllabusResource | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
      const [syllabusData, examsData] = await Promise.all([
        fetch('/api/admin-all?endpoint=syllabus').then(r => r.json()),
        fetch('/api/exams').then(r => r.json())
      ]);
      
      // Add exam names to resources
      const resourcesWithExamNames = (syllabusData.records || []).map((resource: any) => {
        const exam = (examsData.records || []).find((e: any) => 
          e._id === resource.exam_id || e.id === resource.exam_id || e.slug === resource.exam_id
        );
        return { ...resource, exam_name: exam?.name || 'Unknown Exam' };
      });
      
      setSyllabusResources(resourcesWithExamNames);
      setExams(examsData.records || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load syllabus resources');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    try {
      const dataToSend = {
        ...formData,
        file_type: 'pdf'
      };
      
      let response;
      if (editingResource) {
        const resourceId = editingResource._id || editingResource.id;
        response = await fetch(`/api/admin-all?endpoint=syllabus&id=${resourceId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(dataToSend)
        });
      } else {
        response = await fetch('/api/admin-all?endpoint=syllabus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(dataToSend)
        });
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      setSuccessMessage(editingResource ? 'Syllabus updated successfully!' : 'Syllabus added successfully!');
      fetchData();
      setShowForm(false);
      setFormData({ exam_id: '', title: '', description: '', external_url: '' });
      setEditingResource(null);
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving syllabus:', error);
      setError(`Failed to save syllabus: ${error.message}`);
    }
  };

  const handleDelete = async (resource: SyllabusResource) => {
    if (confirm('Are you sure you want to delete this syllabus?')) {
      try {
        const resourceId = resource._id || resource.id;
        const response = await fetch(`/api/admin-all?endpoint=syllabus&id=${resourceId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        setSuccessMessage('Syllabus deleted successfully!');
        fetchData();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting syllabus:', error);
        setError(`Failed to delete syllabus: ${error.message}`);
      }
    }
  };
  
  const handleEdit = (resource: SyllabusResource) => {
    setEditingResource(resource);
    setFormData({
      exam_id: resource.exam_id,
      title: resource.title,
      description: resource.description || '',
      external_url: resource.external_url
    });
    setShowForm(true);
  };

  return (
    <AdminLayout title="Syllabus Management">
      <div className="mb-4">
        <button
          onClick={() => {
            setShowForm(true);
            setEditingResource(null);
            setFormData({ exam_id: '', title: '', description: '', external_url: '' });
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Syllabus Resource
        </button>
        
        {successMessage && (
          <div className="mt-2 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingResource ? 'Edit Syllabus Resource' : 'Add Syllabus Resource'}
          </h3>
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
                {editingResource ? 'Update' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingResource(null);
                  setFormData({ exam_id: '', title: '', description: '', external_url: '' });
                }}
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
                  <tr key={resource._id || resource.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{resource.title}</td>
                    <td className="px-4 py-2">{resource.exam_name}</td>
                    <td className="px-4 py-2">{resource.description}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <a
                          href={resource.external_url || resource.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </a>
                        <button
                          onClick={() => handleEdit(resource)}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(resource)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
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