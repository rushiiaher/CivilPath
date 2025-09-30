import AdminLayout from './AdminLayout';

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Exams</h3>
          <p className="text-3xl font-bold text-blue-600">5</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Resources</h3>
          <p className="text-3xl font-bold text-green-600">24</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Blog Posts</h3>
          <p className="text-3xl font-bold text-purple-600">12</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Categories</h3>
          <p className="text-3xl font-bold text-orange-600">8</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600">
            Add New Exam
          </button>
          <button className="bg-green-500 text-white p-3 rounded hover:bg-green-600">
            Upload Resource
          </button>
          <button className="bg-purple-500 text-white p-3 rounded hover:bg-purple-600">
            Create Blog Post
          </button>
          <button className="bg-orange-500 text-white p-3 rounded hover:bg-orange-600">
            Add Category
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}