import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

interface Exam {
  id: string;
  name: string;
}

interface ExamInfo {
  id: string;
  exam_id: string;
  section_type: string;
  title: string;
  content: string;
  exam_name?: string;
}

export default function AdminExamInfo() {
  const [examInfos, setExamInfos] = useState<ExamInfo[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingInfo, setEditingInfo] = useState<ExamInfo | null>(null);
  const [formData, setFormData] = useState({
    exam_id: '',
    section_type: 'eligibility',
    title: '',
    content: ''
  });

  const token = localStorage.getItem('adminToken');

  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`/api/admin-all?endpoint=${endpoint.replace('/', '')}`, {
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
      const [examInfoData, examsData] = await Promise.all([
        fetch('/api/admin-all?endpoint=exam-info').then(r => r.json()),
        fetch('/api/exams').then(r => r.json())
      ]);
      
      const examInfosWithExamNames = (examInfoData.records || []).map(info => {
        const exam = (examsData.records || []).find(e => 
          e.id === info.exam_id || 
          e.slug === info.exam_id || 
          e._id === info.exam_id ||
          e.name === info.exam_id
        );
        return {
          ...info,
          exam_name: exam ? exam.name : info.exam_id
        };
      });
      
      setExamInfos(examInfosWithExamNames);
      setExams(examsData.records || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for duplicate section type for same exam
    if (!editingInfo) {
      const duplicate = examInfos.find(info => 
        info.exam_id === formData.exam_id && info.section_type === formData.section_type
      );
      if (duplicate) {
        alert('This section type already exists for this exam. Please edit the existing one.');
        return;
      }
    }
    
    try {
      if (editingInfo) {
        await fetch(`/api/admin-all?endpoint=exam-info&id=${editingInfo._id || editingInfo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch('/api/admin-all?endpoint=exam-info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(formData)
        });
      }
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving exam info:', error);
    }
  };

  const handleEdit = (info: ExamInfo) => {
    setEditingInfo(info);
    setFormData({
      exam_id: info.exam_id,
      section_type: info.section_type,
      title: info.title,
      content: info.content
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this exam information?')) {
      try {
        await fetch(`/api/admin-all?endpoint=exam-info&id=${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting exam info:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ exam_id: '', section_type: 'eligibility', title: '', content: '' });
    setEditingInfo(null);
    setShowForm(false);
  };

  const sectionTypes = [
    { value: 'eligibility', label: 'Eligibility Criteria' },
    { value: 'pattern', label: 'Exam Pattern' },
    { value: 'syllabus', label: 'Syllabus' },
    { value: 'dates', label: 'Important Dates' },
    { value: 'notification', label: 'Notification' }
  ];

  return (
    <AdminLayout title="Exam Information">
      <div className="mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Exam Information
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingInfo ? 'Edit Exam Information' : 'Add Exam Information'}
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
                <label className="block text-sm font-bold mb-2">Section Type *</label>
                <select
                  value={formData.section_type}
                  onChange={(e) => setFormData({...formData, section_type: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  required
                  disabled={!!editingInfo}
                >
                  {sectionTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                rows={6}
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
              >
                {editingInfo ? 'Update' : 'Save'}
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
                <th className="px-4 py-2 text-left">Section</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {examInfos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No exam information found
                  </td>
                </tr>
              ) : (
                examInfos.map((info) => (
                  <tr key={info.id} className="border-t">
                    <td className="px-4 py-2">{info.exam_name}</td>
                    <td className="px-4 py-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {sectionTypes.find(t => t.value === info.section_type)?.label}
                      </span>
                    </td>
                    <td className="px-4 py-2">{info.title}</td>
                    <td className="px-4 py-2">
                      <button 
                        onClick={() => handleEdit(info)}
                        className="text-blue-500 mr-2 hover:underline"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(info._id || info.id)}
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