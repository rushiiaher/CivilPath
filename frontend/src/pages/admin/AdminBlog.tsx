import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category_id: string;
  status: string;
  created_at: string;
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'Admin',
    category_id: '',
    featured_image: '',
    status: 'published',
    read_time: 5
  });
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const token = localStorage.getItem('adminToken');

  const uploadImage = async (file: File): Promise<string> => {
    try {
      // Validate file size before upload
      if (file.size > 512000) {
        throw new Error('File size exceeds 500KB limit');
      }
      
      const fileName = `${Date.now()}-${file.name}`;
      const response = await fetch('/api/admin-all?endpoint=upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileName,
          fileType: file.type,
          fileSize: file.size
        })
      });
      
      const result = await response.json();
      return result.url || URL.createObjectURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

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
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await fetch('/api/admin-all?endpoint=blog').then(r => r.json());
      setPosts(data.records || []);
      setError('');
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        slug: formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
        images: uploadedImages,
        featured_image: formData.featured_image
      };
      
      if (editingPost) {
        await fetch(`/api/admin-all?endpoint=blog&id=${editingPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(dataToSend)
        });
      } else {
        await fetch('/api/admin-all?endpoint=blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(dataToSend)
        });
      }
      
      fetchPosts();
      setShowForm(false);
      setFormData({ title: '', excerpt: '', content: '', author: 'Admin', category_id: '', featured_image: '', status: 'published', read_time: 5 });
      setEditingPost(null);
      setUploadedImages([]);
    } catch (error) {
      console.error('Error saving blog post:', error);
    }
  };



  return (
    <AdminLayout title="Blog Posts">
      <div className="mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Post
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full px-3 py-2 border rounded font-mono text-sm"
                rows={10}
                placeholder="Write your blog content here. You can use HTML tags for formatting."
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                Tip: Use HTML tags like &lt;p&gt;, &lt;h3&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt; for formatting
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Featured Image (Max 500KB)</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Check file size (500KB = 512000 bytes)
                    if (file.size > 512000) {
                      alert('Image size must be under 500KB. Please choose a smaller image.');
                      e.target.value = '';
                      return;
                    }
                    const imageUrl = await uploadImage(file);
                    setFormData({...formData, featured_image: imageUrl});
                  }
                }}
                className="w-full px-3 py-2 border rounded"
              />
              <div className="text-xs text-gray-500 mt-1">
                Maximum file size: 500KB. Supported formats: JPG, PNG, GIF, WebP
              </div>
              {formData.featured_image && (
                <div className="mt-2">
                  <img src={formData.featured_image} alt="Featured" className="w-32 h-20 object-cover rounded" />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2">Additional Images (Max 500KB each)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  
                  // Check each file size
                  const oversizedFiles = files.filter(file => file.size > 512000);
                  if (oversizedFiles.length > 0) {
                    alert(`${oversizedFiles.length} image(s) exceed 500KB limit. Please choose smaller images.`);
                    e.target.value = '';
                    return;
                  }
                  
                  const imageUrls = await Promise.all(files.map(uploadImage));
                  setUploadedImages([...uploadedImages, ...imageUrls]);
                }}
                className="w-full px-3 py-2 border rounded mb-2"
              />
              <div className="text-xs text-gray-500 mb-2">
                Maximum file size per image: 500KB. Supported formats: JPG, PNG, GIF, WebP
              </div>
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img src={image} alt={`Upload ${index}`} className="w-full h-20 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = uploadedImages.filter((_, i) => i !== index);
                          setUploadedImages(newImages);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-4">
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
                <label className="block text-sm font-bold mb-2">Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Select Category</option>
                  <option value="1">Current Affairs</option>
                  <option value="2">Study Tips</option>
                  <option value="3">Exam Updates</option>
                  <option value="4">Success Stories</option>
                  <option value="5">General Knowledge</option>
                  <option value="6">Interview Preparation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Read Time (min)</label>
                <input
                  type="number"
                  value={formData.read_time}
                  onChange={(e) => setFormData({...formData, read_time: parseInt(e.target.value) || 5})}
                  className="w-full px-3 py-2 border rounded"
                  min="1"
                  max="60"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
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
                <th className="px-4 py-2 text-left">Author</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No blog posts found
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <div className="font-medium">{post.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{post.excerpt}</div>
                    </td>
                    <td className="px-4 py-2">{post.author}</td>
                    <td className="px-4 py-2">
                      <span className="text-sm text-gray-600">General</span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{new Date(post.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingPost(post);
                            setFormData({
                              title: post.title,
                              excerpt: post.excerpt,
                              content: post.content,
                              author: post.author,
                              category_id: post.category_id || '',
                              featured_image: (post as any).featured_image || '',
                              status: post.status,
                              read_time: (post as any).read_time || 5
                            });
                            setShowForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete this post?')) {
                              try {
                                await fetch(`/api/admin-all?endpoint=blog&id=${post.id}`, {
                                  method: 'DELETE',
                                  headers: { 'Authorization': `Bearer ${token}` }
                                });
                                fetchPosts();
                              } catch (error) {
                                console.error('Error deleting post:', error);
                              }
                            }
                          }}
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