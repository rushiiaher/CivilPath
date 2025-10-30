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
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
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
      const [subjectsData, examsData, stagesData] = await Promise.all([
        fetch('/api/admin-all?endpoint=subjects').then(r => r.json()),
        fetch('/api/exams').then(r => r.json()),
        fetch('/api/admin-all?endpoint=stages').then(r => r.json())
      ]);
      
      console.log('Exams loaded:', examsData);
      
      const subjectsWithNames = (subjectsData.records || []).map(subject => {
        const exam = (examsData.records || []).find(e => 
          (e._id || e.id) === subject.exam_id || e.slug === subject.exam_id || e.name === subject.exam_id
        );
        
        // If no exam_id, try to find exam through stage
        let examFromStage = null;
        if (!exam && subject.stage_id) {
          const stage = (stagesData.records || []).find(s => 
            (s._id || s.id) === subject.stage_id || s.name === subject.stage_id
          );
          if (stage && stage.exam_id) {
            examFromStage = (examsData.records || []).find(e => 
              (e._id || e.id) === stage.exam_id || e.slug === stage.exam_id || e.name === stage.exam_id
            );
          }
        }
        const stage = (stagesData.records || []).find(s => 
          s.id === subject.stage_id || s._id === subject.stage_id
        );
        return {
          ...subject,
          exam_name: exam ? exam.name : (examFromStage ? examFromStage.name : 'No Exam'),
          stage_name: stage ? stage.name : subject.stage_id
        };
      });
      
      setSubjects(subjectsWithNames);
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
      const data = await fetch(`/api/admin-all?endpoint=stages&exam_id=${examId}`).then(r => r.json());
      setStages(data.records || []);
    } catch (error) {
      console.error('Error fetching stages:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        exam_id: formData.exam_id,
        stage_id: formData.stage_id,
        name: formData.name,
        description: formData.description,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      };
      
      console.log('Saving subject with data:', dataToSend);
      
      if (editingSubject) {
        await fetch(`/api/admin-all?endpoint=subjects&id=${editingSubject._id || editingSubject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(dataToSend)
        });
      } else {
        await fetch('/api/admin-all?endpoint=subjects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(dataToSend)
        });
      }
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving subject:', error);
    }
  };

  const handleEdit = async (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      exam_id: subject.exam_id,
      stage_id: subject.stage_id,
      name: subject.name,
      description: subject.description || ''
    });
    
    // Load stages for the selected exam
    if (subject.exam_id) {
      await fetchStages(subject.exam_id);
    }
    
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      try {
        await fetch(`/api/admin-all?endpoint=subjects&id=${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting subject:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ exam_id: '', stage_id: '', name: '', description: '' });
    setEditingSubject(null);
    setShowForm(false);
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
          <h3 className="text-lg font-semibold mb-4">
            {editingSubject ? 'Edit Subject' : 'Add New Subject'}
          </h3>
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
                    <option key={exam._id || exam.id} value={exam._id || exam.id}>{exam.name}</option>
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
                {editingSubject ? 'Update' : 'Save'}
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
                      <button 
                        onClick={() => handleEdit(subject)}
                        className="text-blue-500 mr-2 hover:underline"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(subject._id || subject.id)}
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