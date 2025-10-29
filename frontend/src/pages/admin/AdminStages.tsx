import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

interface Exam {
  id: string;
  name: string;
}

interface Stage {
  id: string;
  exam_id: string;
  name: string;
  description: string;
  exam_name?: string;
}

export default function AdminStages() {
  const [stages, setStages] = useState<Stage[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStage, setEditingStage] = useState<Stage | null>(null);
  const [formData, setFormData] = useState({
    exam_id: '',
    name: '',
    description: ''
  });

  const token = localStorage.getItem('adminToken');

  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const url = endpoint.startsWith('/') ? `/api${endpoint}` : `/api/admin-all?endpoint=${endpoint}`;
    const response = await fetch(url, {
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
      const [stagesData, examsData] = await Promise.all([
        fetch('/api/admin-all?endpoint=stages').then(r => r.json()),
        fetch('/api/exams').then(r => r.json())
      ]);
      
      const stagesWithExamNames = (stagesData.records || []).map(stage => {
        const exam = (examsData.records || []).find(e => 
          e.id === stage.exam_id || 
          e.slug === stage.exam_id || 
          e._id === stage.exam_id ||
          e.name === stage.exam_id
        );
        return {
          ...stage,
          exam_name: exam ? exam.name : stage.exam_id
        };
      });
      
      setStages(stagesWithExamNames);
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
      const dataToSend = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      };
      
      if (editingStage) {
        await fetch(`/api/admin-all?endpoint=stages&id=${editingStage._id || editingStage.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(dataToSend)
        });
      } else {
        await fetch('/api/admin-all?endpoint=stages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(dataToSend)
        });
      }
      
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving stage:', error);
    }
  };

  const handleEdit = (stage: Stage) => {
    setEditingStage(stage);
    setFormData({
      exam_id: stage.exam_id,
      name: stage.name,
      description: stage.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this stage?')) {
      try {
        await fetch(`/api/admin-all?endpoint=stages&id=${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting stage:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ exam_id: '', name: '', description: '' });
    setEditingStage(null);
    setShowForm(false);
  };

  const predefinedStages = [
    'Prelims',
    'Mains', 
    'Optional',
    'Interview',
    'Physical Test',
    'Medical Test',
    'Test Series',
    'Current Affairs'
  ];

  return (
    <AdminLayout title="Exam Stages">
      <div className="mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Exam Stage
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingStage ? 'Edit Exam Stage' : 'Add Exam Stage'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
                    <option key={exam.id} value={exam.id}>{exam.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Stage Name *</label>
                <select
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">Select Stage</option>
                  {predefinedStages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                rows={3}
                placeholder="Brief description of this exam stage"
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
              >
                {editingStage ? 'Update' : 'Save'}
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
                <th className="px-4 py-2 text-left">Exam</th>
                <th className="px-4 py-2 text-left">Stage</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No exam stages found
                  </td>
                </tr>
              ) : (
                stages.map((stage) => (
                  <tr key={stage.id} className="border-t">
                    <td className="px-4 py-2">{stage.exam_name}</td>
                    <td className="px-4 py-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {stage.name}
                      </span>
                    </td>
                    <td className="px-4 py-2">{stage.description}</td>
                    <td className="px-4 py-2">
                      <button 
                        onClick={() => handleEdit(stage)}
                        className="text-blue-500 mr-2 hover:underline"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(stage._id || stage.id)}
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