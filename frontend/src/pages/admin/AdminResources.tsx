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
  name: string;
}

interface ResourceType {
  id: string;
  name: string;
}

interface Resource {
  id: string;
  exam_id: string;
  stage_id: string;
  subject_id: string;
  resource_type_id: string;
  title: string;
  description: string;
  file_path: string;
  author: string;
  year: string;
  exam_name?: string;
  stage_name?: string;
  subject_name?: string;
  resource_type_name?: string;
}

export default function AdminResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    exam_id: '',
    stage_id: '',
    subject_id: '',
    resource_type_id: '',
    title: '',
    description: '',
    author: '',
    year: new Date().getFullYear().toString(),
    external_url: ''
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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resourcesData, examsData, resourceTypesData] = await Promise.all([
        apiRequest('/resources'),
        apiRequest('/exams'),
        apiRequest('/resource-types')
      ]);
      
      setResources(resourcesData.records || []);
      setExams(examsData.records || []);
      setResourceTypes(resourceTypesData.records || []);
      setError('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
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

  const fetchSubjects = async (stageId: string) => {
    if (!stageId) return;
    try {
      const data = await apiRequest(`/subjects?stage_id=${stageId}`);
      setSubjects(data.records || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/resources', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      fetchData();
      setShowForm(false);
      setFormData({
        exam_id: '',
        stage_id: '',
        subject_id: '',
        resource_type_id: '',
        title: '',
        description: '',
        author: '',
        year: new Date().getFullYear().toString(),
        external_url: ''
      });
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };

  return (
    <AdminLayout title="Resources Management">
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Exam *</label>
                <select
                  value={formData.exam_id}
                  onChange={(e) => {
                    setFormData({...formData, exam_id: e.target.value, stage_id: '', subject_id: ''});
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
                  onChange={(e) => {
                    setFormData({...formData, stage_id: e.target.value, subject_id: ''});
                    fetchSubjects(e.target.value);
                  }}
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Subject</label>
                <select
                  value={formData.subject_id}
                  onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  disabled={!formData.stage_id}
                >
                  <option value="">Select Subject (Optional)</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Resource Type *</label>
                <select
                  value={formData.resource_type_id}
                  onChange={(e) => setFormData({...formData, resource_type_id: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">Select Type</option>
                  {resourceTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
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
              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Year</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">External URL (if applicable)</label>
              <input
                type="url"
                value={formData.external_url}
                onChange={(e) => setFormData({...formData, external_url: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                placeholder="https://example.com/resource"
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
        ) : error ? (
          <div className="p-4 text-red-600">{error}</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Exam</th>
                <th className="px-4 py-2 text-left">Stage</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Author</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No resources found
                  </td>
                </tr>
              ) : (
                resources.map((resource) => (
                  <tr key={resource.id} className="border-t">
                    <td className="px-4 py-2">
                      <div>
                        <div className="font-medium">{resource.title}</div>
                        <div className="text-sm text-gray-500">{resource.description}</div>
                      </div>
                    </td>
                    <td className="px-4 py-2">{resource.exam_name}</td>
                    <td className="px-4 py-2">{resource.stage_name}</td>
                    <td className="px-4 py-2">{resource.resource_type_name}</td>
                    <td className="px-4 py-2">{resource.author}</td>
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