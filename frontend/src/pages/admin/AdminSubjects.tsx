import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

interface Exam {
  id: string;
  name: string;
}

interface Stage {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  exam_id: string;
  stage_id: string;
  name: string;
  description: string;
  exam_name?: string;
  stage_name?: string;
}

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    exam_id: '',
    stage_id: '',
    name: '',
    description: ''
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
      const [subjectsData, examsData] = await Promise.all([
        apiRequest('/subjects'),
        apiRequest('/exams')
      ]);
      setSubjects(subjectsData.records || []);
      setExams(examsData.records || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStages = async (examId: string) => {
    if (!examId) return;
    try {
      const data = await apiRequest(`/stages?exam_id=${examId}`);
      setStages(data.records || []);
    } catch (error) {
      console.error('Error fetching stages:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      };
      
      await apiRequest('/subjects', {
        method: 'POST',
        body: JSON.stringify(dataToSend)
      });
      fetchData();
      setShowForm(false);
      setFormData({ exam_id: '', stage_id: '', name: '', description: '' });
    } catch (error) {
      console.error('Error saving subject:', error);
    }
  };

  return (
    <AdminLayout title="Subjects Management">
      <div className="mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Subject
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Subject</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Exam *</label>
                <select
                  value={formData.exam_id}
                  onChange={(e) => {
                    setFormData({...formData, exam_id: e.target.value, stage_id: ''});
                    fetchStages(e.target.value);
                  }}
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
                <label className="block text-sm font-bold mb-2">Stage *</label>
                <select
                  value={formData.stage_id}
                  onChange={(e) => setFormData({...formData, stage_id: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  required
                  disabled={!formData.exam_id}
                >
                  <option value="">Select Stage</option>
                  {stages.map(stage => (
                    <option key={stage.id} value={stage.id}>{stage.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Subject Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                placeholder="e.g., History, Geography, Mathematics"
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
                <th className="px-4 py-2 text-left">Subject</th>
                <th className="px-4 py-2 text-left">Exam</th>
                <th className="px-4 py-2 text-left">Stage</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No subjects found
                  </td>
                </tr>
              ) : (
                subjects.map((subject) => (
                  <tr key={subject.id} className="border-t">
                    <td className="px-4 py-2 font-medium">{subject.name}</td>
                    <td className="px-4 py-2">{subject.exam_name}</td>
                    <td className="px-4 py-2">{subject.stage_name}</td>
                    <td className="px-4 py-2">{subject.description}</td>
                    <td className="px-4 py-2">
                      <button className="text-blue-500 mr-2 hover:underline">Edit</button>
                      <button className="text-red-500 hover:underline">Delete</button>
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