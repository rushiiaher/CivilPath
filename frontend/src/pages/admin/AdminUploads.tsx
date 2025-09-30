import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

interface FileUpload {
  id: string;
  original_name: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export default function AdminUploads() {
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem('adminToken');

  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });
    return response.json();
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      const data = await apiRequest('/uploads');
      setUploads(data.records || []);
    } catch (error) {
      console.error('Error fetching uploads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    setUploading(false);
    fetchUploads();
    e.target.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      try {
        await apiRequest(`/uploads?id=${id}`, { method: 'DELETE' });
        fetchUploads();
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  return (
    <AdminLayout title="File Uploads">
      <div className="mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Upload Files</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mp3"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer"
            >
              <div className="text-gray-600">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-2 text-sm">
                  <span className="font-medium text-blue-600 hover:text-blue-500">
                    Click to upload files
                  </span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, Images, Videos up to 10MB
                </p>
              </div>
            </label>
          </div>
          {uploading && (
            <div className="mt-4 text-center">
              <div className="text-blue-600">Uploading files...</div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">File Name</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Size</th>
                <th className="px-4 py-2 text-left">Uploaded</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {uploads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No files uploaded yet
                  </td>
                </tr>
              ) : (
                uploads.map((upload) => (
                  <tr key={upload.id} className="border-t">
                    <td className="px-4 py-2">
                      <div>
                        <div className="font-medium">{upload.original_name}</div>
                        <div className="text-sm text-gray-500">{upload.file_name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                        {upload.mime_type}
                      </span>
                    </td>
                    <td className="px-4 py-2">{formatFileSize(upload.file_size)}</td>
                    <td className="px-4 py-2">
                      {new Date(upload.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <a
                        href={upload.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 mr-2 hover:underline"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleDelete(upload.id)}
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