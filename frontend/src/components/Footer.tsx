import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-700" style={{backgroundColor: '#003060'}}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-white" />
              <span className="text-lg font-bold font-heading text-white">CivilServices.org</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Your comprehensive platform for civil services preparation. 
              We provide quality study material, practice tests, and resources 
              for UPSC and Maharashtra State Services examinations.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-heading text-white">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/blog" 
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Blog
              </Link>
              <Link 
                to="/contact" 
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Popular Exams */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-heading text-white">Popular Exams</h3>
            <div className="flex flex-col space-y-2">
              <Link 
                to="/exams/upsc" 
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                UPSC Civil Services
              </Link>
              <Link 
                to="/exams/mpsc-state-service" 
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                MPSC (Rajyaseva)
              </Link>
              <Link 
                to="/exams/mpsc-combined" 
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                MPSC Combined
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-sm text-gray-300">
            © 2024 CivilServices.org. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;