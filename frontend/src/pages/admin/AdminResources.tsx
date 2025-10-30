import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { convertToDirectDownloadLink, isValidGoogleDriveUrl } from '../../utils/googleDrive';

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
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
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
      const [resourcesData, examsData, resourceTypesData, stagesData] = await Promise.all([
        fetch('/api/admin-all?endpoint=resources').then(r => r.json()),
        fetch('/api/exams').then(r => r.json()),
        fetch('/api/admin-all?endpoint=resource-types').then(r => r.json()),
        fetch('/api/admin-all?endpoint=stages').then(r => r.json())
      ]);
      
      const resourcesWithNames = (resourcesData.records || []).map(resource => {
        const exam = (examsData.records || []).find(e => 
          (e._id || e.id) === resource.exam_id || e.slug === resource.exam_id || e.name === resource.exam_id
        );
        const stage = (stagesData.records || []).find(s => 
          (s._id || s.id) === resource.stage_id
        );
        return {
          ...resource,
          exam_name: exam ? exam.name : resource.exam_id,
          stage_name: stage ? stage.name : resource.stage_id,
          resource_type_name: resource.resource_type_id
        };
      });
      
      setResources(resourcesWithNames);
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
      // Fetch all stages and filter by exam_id
      const data = await fetch('/api/admin-all?endpoint=stages').then(r => r.json());
      const examStages = (data.records || []).filter((stage: any) => 
        stage.exam_id === examId || 
        stage.exam_id === exams.find(e => (e._id || e.id) === examId)?.name ||
        stage.exam_id === exams.find(e => (e._id || e.id) === examId)?.slug
      );
      console.log('Fetching stages for exam:', examId);
      console.log('Filtered stages for resources:', examStages);
      setStages(examStages);
    } catch (error) {
      console.error('Error fetching stages:', error);
    }
  };

  const fetchSubjects = async (stageId: string) => {
    if (!stageId) return;
    try {
      const data = await fetch(`/api/admin-all?endpoint=subjects&stage_id=${stageId}`).then(r => r.json());
      setSubjects(data.records || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Google Drive URL
    if (formData.external_url && !isValidGoogleDriveUrl(formData.external_url)) {
      alert('Please enter a valid Google Drive URL');
      return;
    }
    
    try {
      if (editingResource) {
        await fetch(`/api/admin-all?endpoint=resources&id=${editingResource._id || editingResource.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch('/api/admin-all?endpoint=resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(formData)
        });
      }
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };

  const handleEdit = async (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      exam_id: resource.exam_id,
      stage_id: resource.stage_id,
      subject_id: resource.subject_id || '',
      resource_type_id: resource.resource_type_id,
      title: resource.title,
      description: resource.description || '',
      author: resource.author || '',
      year: resource.year || new Date().getFullYear().toString(),
      external_url: resource.external_url || ''
    });
    
    // Load stages and subjects for the selected exam
    if (resource.exam_id) {
      await fetchStages(resource.exam_id);
      if (resource.stage_id) {
        await fetchSubjects(resource.stage_id);
      }
    }
    
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      try {
        await fetch(`/api/admin-all?endpoint=resources&id=${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    }
  };

  const resetForm = () => {
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
    setEditingResource(null);
    setShowForm(false);
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
          <h3 className="text-lg font-semibold mb-4">
            {editingResource ? 'Edit Resource' : 'Add New Resource'}
          </h3>
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
                    <option key={exam._id || exam.id} value={exam._id || exam.id}>{exam.name}</option>
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
                    <option key={stage._id || stage.id} value={stage._id || stage.id}>{stage.name}</option>
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
                  <option value="pdf">📄 PDF</option>
                  <option value="video">🎥 Video</option>
                  <option value="live">🔴 Live Session</option>
                  <option value="notes">📝 Notes</option>
                  <option value="test">📊 Test Series</option>
                  <option value="book">📚 Book</option>
                  <option value="audio">🎧 Audio</option>
                  <option value="image">🖼️ Image</option>
                  <option value="other">📁 Other</option>
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
              <label className="block text-sm font-bold mb-2">Google Drive URL *</label>
              <input
                type="url"
                value={formData.external_url}
                onChange={(e) => setFormData({...formData, external_url: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                placeholder="https://drive.google.com/file/d/your-file-id/view"
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                Paste the Google Drive shareable link here. Make sure the file is set to "Anyone with the link can view"
              </div>
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
                <th className="px-4 py-2 text-left">Year</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
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
                    <td className="px-4 py-2">{resource.year}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        {resource.external_url && (
                          <a
                            href={convertToDirectDownloadLink(resource.external_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                            onClick={() => {
                              // Track download count
                              fetch(`/api/admin-all?endpoint=resources&id=${resource.id}&action=download`, {
                                method: 'POST'
                              }).catch(console.error);
                            }}
                          >
                            Download
                          </a>
                        )}
                        <button 
                          onClick={() => handleEdit(resource)}
                          className="text-blue-500 hover:underline text-sm"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(resource._id || resource.id)}
                          className="text-red-500 hover:underline text-sm"
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