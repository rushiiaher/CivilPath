import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, X, BookOpen, ChevronDown } from 'lucide-react';
import { apiService, Exam } from '@/services/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExamMenuOpen, setIsExamMenuOpen] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const location = useLocation();
  
  useEffect(() => {
    loadExams();
  }, []);
  
  const loadExams = async () => {
    try {
      const response = await apiService.getExams();
      setExams(response.records || []);
    } catch (error) {
      console.error('Error loading exams in header:', error);
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur" style={{backgroundColor: '#003060'}}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-white" />
            <span className="text-xl font-bold font-heading text-white">
              CivilServices.org
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-base font-medium transition-colors hover:text-gray-200 ${
                isActive('/')
                  ? 'text-white font-semibold'
                  : 'text-gray-300'
              }`}
            >
              Home
            </Link>
            
            {/* Exams Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={`text-base font-medium transition-colors hover:text-gray-200 ${
                    location.pathname.startsWith('/exams')
                      ? 'text-white font-semibold'
                      : 'text-gray-300'
                  }`}
                >
                  Exams
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-64 bg-background border border-border shadow-lg z-50"
              >

                {exams.map((exam) => (
                  <DropdownMenuItem key={exam.id} asChild>
                    <Link 
                      to={`/exams/${exam.slug}`} 
                      className="w-full cursor-pointer hover:bg-accent"
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium text-sm">{exam.name}</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link
              to="/blog"
              className={`text-base font-medium transition-colors hover:text-gray-200 ${
                isActive('/blog')
                  ? 'text-white font-semibold'
                  : 'text-gray-300'
              }`}
            >
              Blog
            </Link>
            
            <Link
              to="/contact"
              className={`text-base font-medium transition-colors hover:text-gray-200 ${
                isActive('/contact')
                  ? 'text-white font-semibold'
                  : 'text-gray-300'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-blue-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors hover:text-gray-200 px-2 py-1 ${
                  isActive('/')
                    ? 'text-white font-semibold'
                    : 'text-gray-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {/* Mobile Exams Section */}
              <div className="px-2 py-1">
                <button
                  onClick={() => setIsExamMenuOpen(!isExamMenuOpen)}
                  className="text-sm font-medium text-white hover:text-gray-200 transition-colors w-full text-left flex items-center"
                >
                  Exams
                  <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${isExamMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {isExamMenuOpen && (
                  <div className="ml-4 space-y-2 mt-2">
                    {exams.map((exam) => (
                      <Link
                        key={exam.id}
                        to={`/exams/${exam.slug}`}
                        className="block text-xs text-gray-300 hover:text-white transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {exam.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <Link
                to="/blog"
                className={`text-sm font-medium transition-colors hover:text-gray-200 px-2 py-1 ${
                  isActive('/blog')
                    ? 'text-white font-semibold'
                    : 'text-gray-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              
              <Link
                to="/contact"
                className={`text-sm font-medium transition-colors hover:text-gray-200 px-2 py-1 ${
                  isActive('/contact')
                    ? 'text-white font-semibold'
                    : 'text-gray-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;