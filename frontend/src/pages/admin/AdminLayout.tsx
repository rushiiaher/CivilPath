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
            <ul className="space-y-2">
              <li>
                <Link to="/admin/dashboard" className="block p-2 hover:bg-gray-100 rounded">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/exams" className="block p-2 hover:bg-gray-100 rounded">
                  Exams
                </Link>
              </li>
              <li>
                <Link to="/admin/resources" className="block p-2 hover:bg-gray-100 rounded">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/admin/blog" className="block p-2 hover:bg-gray-100 rounded">
                  Blog Posts
                </Link>
              </li>
              <li>
                <Link to="/admin/categories" className="block p-2 hover:bg-gray-100 rounded">
                  Categories
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