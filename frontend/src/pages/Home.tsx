import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import ExamCard from '@/components/ExamCard';
import { Search, ArrowRight } from 'lucide-react';
import { apiService, Exam } from '@/services/api';
import { inspirationalQuotes } from '@/data/sample-data';
import heroImage from '@/assets/banner.jpg';
import img1 from '@/assets/Comprehensive Study Material.jpg';
import img2 from '@/assets/Previous Year Papers.jpg';
import img3 from '@/assets/Expert Guidance.jpg';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentQuote] = useState(inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)]);
  const [searchMessage, setSearchMessage] = useState('');
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const response = await apiService.getExams();
      setExams(response.records || []);
    } catch (error) {
      console.error('Error loading exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(exams.map(exam => exam.category))];

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exam.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exam.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const foundExam = exams.find(exam => 
        exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.slug.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (foundExam) {
        navigate(`/exams/${foundExam.slug}`);
        setSearchMessage('');
      } else {
        setSearchMessage('Exam not available');
        setTimeout(() => setSearchMessage(''), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative py-12 md:py-20 px-4 h-[70vh] md:h-[80vh] flex items-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: window.innerWidth >= 768 ? 'fixed' : 'scroll',
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold font-heading leading-tight text-white">
                Path to Civil Services
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Comprehensive study materials, practice tests, and resources for UPSC and Maharashtra State Services examinations.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-lg mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search exams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="pl-12 pr-4 py-4 text-lg bg-white/95 backdrop-blur-sm border-2 border-black rounded-xl shadow-xl focus:ring-2 focus:ring-white/50"
                />
                {searchMessage && (
                  <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                    {searchMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inspirational Quote Section */}
      <section className="py-8 md:py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <blockquote className="text-lg md:text-3xl font-medium text-gray-800 leading-relaxed italic relative">
              <span className="text-4xl md:text-6xl text-blue-200 absolute -top-2 md:-top-4 -left-2 md:-left-4">"</span>
              Every page you read, every hour you dedicate, and every failure you overcome brings you one step closer to the dream of serving your country with pride and responsibility.
              <span className="text-4xl md:text-6xl text-blue-200 absolute -bottom-4 md:-bottom-8 -right-2 md:-right-4">"</span>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-4 leading-tight">
              Everything you need for your
              <span className="text-blue-600 block">preparation journey</span>
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="p-4 md:p-6">
              <img 
                src={img1} 
                alt="Comprehensive Study Material" 
                className="w-full h-auto object-contain rounded-lg mx-auto max-w-sm max-h-80"
              />
            </div>
            
            <div className="p-4 md:p-6">
              <img 
                src={img2} 
                alt="Previous Year Papers" 
                className="w-full h-auto object-contain rounded-lg mx-auto max-w-sm max-h-80"
              />
            </div>
            
            <div className="p-4 md:p-6">
              <img 
                src={img3} 
                alt="Expert Guidance" 
                className="w-full h-auto object-contain rounded-lg mx-auto max-w-sm max-h-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Exams and Content Section */}
      <section className="py-16 bg-gray-50">
        <div className="w-full px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full">
            {/* Left Side - Your Exams */}
            <div className="lg:col-span-1">
              <div className="w-full max-w-sm mx-auto lg:mx-0 lg:ml-24">
                <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center font-heading relative">
                  Your Exams
                  <div className="w-16 h-1 bg-blue-600 mx-auto mt-2 rounded-full"></div>
                </h3>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <Link to="/exams/upsc" className="flex items-center w-full h-20 px-5 text-gray-800 font-medium text-base transition-all duration-300 hover:opacity-90 hover:translate-x-1" style={{backgroundColor: '#dbeafe'}}>
                  <svg className="w-8 h-8 mr-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                  </svg>
                  <div className="leading-tight">
                    <div className="text-lg font-semibold">UPSC</div>
                    <div className="text-sm opacity-90">Civil Services Examination</div>
                  </div>
                </Link>
                
                <Link to="/exams/mpsc-state-service" className="flex items-center w-full h-20 px-5 text-gray-800 font-medium text-base transition-all duration-300 hover:opacity-90 hover:translate-x-1" style={{backgroundColor: '#d1fae5'}}>
                  <svg className="w-8 h-8 mr-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                  </svg>
                  <div className="leading-tight">
                    <div className="text-lg font-semibold">MPSC State Service</div>
                    <div className="text-sm opacity-90">Maharashtra Rajyaseva</div>
                  </div>
                </Link>
                
                <Link to="/exams/mpsc-combined" className="flex items-center w-full h-20 px-5 text-gray-800 font-medium text-base transition-all duration-300 hover:opacity-90 hover:translate-x-1" style={{backgroundColor: '#fecaca'}}>
                  <svg className="w-8 h-8 mr-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                  </svg>
                  <div className="leading-tight">
                    <div className="text-lg font-semibold">MPSC Combined</div>
                    <div className="text-sm opacity-90">Group B & C Exams</div>
                  </div>
                </Link>
                
                <Link to="/exams/mpsc-engineering" className="flex items-center w-full h-20 px-5 text-gray-800 font-medium text-base transition-all duration-300 hover:opacity-90 hover:translate-x-1" style={{backgroundColor: '#e0e7ff'}}>
                  <svg className="w-8 h-8 mr-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                  </svg>
                  <div className="leading-tight">
                    <div className="text-lg font-semibold">MPSC Engineering</div>
                    <div className="text-sm opacity-90">Engineering Services</div>
                  </div>
                </Link>
                
                <Link to="/exams/mpsc-agriculture" className="flex items-center w-full h-20 px-5 text-gray-800 font-medium text-base transition-all duration-300 hover:opacity-90 hover:translate-x-1" style={{backgroundColor: '#fed7aa'}}>
                  <svg className="w-8 h-8 mr-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
                  </svg>
                  <div className="leading-tight">
                    <div className="text-lg font-semibold">MPSC Agriculture</div>
                    <div className="text-sm opacity-90">Agriculture Services</div>
                  </div>
                </Link>
                </div>
              </div>
            </div>
            
            {/* Right Side - About Content */}
            <div className="lg:col-span-2 flex items-center">
              <div className="space-y-5 w-full">
                <p className="text-lg md:text-2xl font-normal text-gray-700 leading-relaxed">
                  Welcome to your comprehensive civil services preparation platform. We provide meticulously curated study materials, previous year question papers, and expert guidance to help you achieve your dream of serving the nation.
                </p>
                
                <p className="text-lg md:text-2xl font-normal text-gray-700 leading-relaxed">
                  Our platform covers all major examinations including UPSC Civil Services and Maharashtra Public Service Commission exams, ensuring you have access to the most relevant and up-to-date content for your preparation journey.
                </p>
                
                <p className="text-lg md:text-2xl font-normal text-gray-700 leading-relaxed">
                  Start your preparation today with our structured approach, comprehensive resources, and proven strategies that have helped thousands of aspirants achieve success in their civil services examinations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;