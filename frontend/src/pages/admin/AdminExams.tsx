import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

interface Exam {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  status: string;
}

export default function AdminExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    status: 'active'
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
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const data = await apiRequest('/exams');
      setExams(data.records || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      };

      if (editingExam) {
        await apiRequest(`/exams?id=${editingExam.id}`, {
          method: 'PUT',
          body: JSON.stringify(dataToSend)
        });
      } else {
        await apiRequest('/exams', {
          method: 'POST',
          body: JSON.stringify(dataToSend)
        });
      }
      fetchExams();
      resetForm();
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this exam?')) {
      try {
        await apiRequest(`/exams?id=${id}`, { method: 'DELETE' });
        fetchExams();
      } catch (error) {
        console.error('Error deleting exam:', error);
      }
    }
  };

  const handleEdit = (exam: Exam) => {
    setEditingExam(exam);
    setFormData({
      name: exam.name,
      description: exam.description || '',
      category: exam.category || '',
      status: exam.status
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      status: 'active'
    });
    setEditingExam(null);
    setShowForm(false);
  };

  return (
    <AdminLayout title="Exams Management">
      <div className="mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Exam
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingExam ? 'Edit Exam' : 'Add New Exam'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Exam Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                placeholder="e.g., UPSC Civil Services"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select Category</option>
                <option value="Central Government">Central Government</option>
                <option value="State Government">State Government</option>
                <option value="Banking">Banking</option>
                <option value="Railway">Railway</option>
                <option value="Defense">Defense</option>
                <option value="Technical Services">Technical Services</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                rows={3}
                placeholder="Brief description of the exam"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
              >
                {editingExam ? 'Update' : 'Save'}
              </button>
              <button
                type="button"
                onClick={resetForm}
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
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No exams found. Add your first exam to get started.
                  </td>
                </tr>
              ) : (
                exams.map((exam) => (
                  <tr key={exam.id} className="border-t">
                    <td className="px-4 py-2">
                      <div>
                        <div className="font-medium">{exam.name}</div>
                        <div className="text-sm text-gray-500">{exam.description}</div>
                      </div>
                    </td>
                    <td className="px-4 py-2">{exam.category || 'N/A'}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        exam.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {exam.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEdit(exam)}
                        className="text-blue-500 mr-2 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(exam.id)}
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