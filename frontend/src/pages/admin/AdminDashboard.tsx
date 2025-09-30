import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';

interface DashboardStats {
  totalExams: number;
  totalResources: number;
  totalBlogPosts: number;
  totalStages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalExams: 0,
    totalResources: 0,
    totalBlogPosts: 0,
    totalStages: 0
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('adminToken');

  const apiRequest = async (endpoint: string) => {
    try {
      const response = await fetch(`/api${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return { records: [] };
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [exams, resources, blogPosts, stages] = await Promise.all([
        apiRequest('/exams'),
        apiRequest('/resources'),
        apiRequest('/blog'),
        apiRequest('/admin?type=stages')
      ]);

      setStats({
        totalExams: exams.records?.length || 0,
        totalResources: resources.records?.length || 0,
        totalBlogPosts: blogPosts.records?.length || 0,
        totalStages: stages.records?.length || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Exams</h3>
          <p className="text-3xl font-bold text-blue-600">
            {loading ? '...' : stats.totalExams}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Resources</h3>
          <p className="text-3xl font-bold text-green-600">
            {loading ? '...' : stats.totalResources}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Blog Posts</h3>
          <p className="text-3xl font-bold text-purple-600">
            {loading ? '...' : stats.totalBlogPosts}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Exam Stages</h3>
          <p className="text-3xl font-bold text-orange-600">
            {loading ? '...' : stats.totalStages}
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/admin/exams"
            className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 text-center"
          >
            Add New Exam
          </Link>
          <Link 
            to="/admin/resources"
            className="bg-green-500 text-white p-3 rounded hover:bg-green-600 text-center"
          >
            Upload Resource
          </Link>
          <Link 
            to="/admin/blog"
            className="bg-purple-500 text-white p-3 rounded hover:bg-purple-600 text-center"
          >
            Create Blog Post
          </Link>
          <Link 
            to="/admin/stages"
            className="bg-orange-500 text-white p-3 rounded hover:bg-orange-600 text-center"
          >
            Add Stage
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}