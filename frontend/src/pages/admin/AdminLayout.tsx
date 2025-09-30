import { Link, useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Civil Path Study - Admin Panel</h1>
          <button 
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex">
        <div className="w-64 bg-white shadow-md min-h-screen">
          <div className="p-4">
            <ul className="space-y-1">
              <li>
                <Link to="/admin/dashboard" className="block p-2 hover:bg-gray-100 rounded text-sm">
                  📊 Dashboard
                </Link>
              </li>
              <li className="pt-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 mb-1">Exam Management</div>
                <Link to="/admin/exams" className="block p-2 hover:bg-gray-100 rounded text-sm">
                  📚 Exams
                </Link>
                <Link to="/admin/exam-info" className="block p-2 hover:bg-gray-100 rounded text-sm">
                  📋 Exam Information
                </Link>
                <Link to="/admin/stages" className="block p-2 hover:bg-gray-100 rounded text-sm">
                  🎯 Exam Stages
                </Link>
                <Link to="/admin/subjects" className="block p-2 hover:bg-gray-100 rounded text-sm">
                  📖 Subjects
                </Link>
              </li>
              <li className="pt-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 mb-1">Content</div>
                <Link to="/admin/resources" className="block p-2 hover:bg-gray-100 rounded text-sm">
                  📁 Resources
                </Link>
                <Link to="/admin/blog" className="block p-2 hover:bg-gray-100 rounded text-sm">
                  ✍️ Blog Posts
                </Link>
                <Link to="/admin/uploads" className="block p-2 hover:bg-gray-100 rounded text-sm">
                  📤 File Uploads
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}