import { useState, useEffect } from 'react';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { apiService, BlogPost } from '../services/api';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadBlogPosts();
  }, []);
  
  const loadBlogPosts = async () => {
    try {
      const response = await apiService.getBlogPosts();
      setBlogPosts(response.records || []);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const staticBlogPosts = [
    {
      id: 1,
      title: "UPSC Prelims 2024: Key Changes and Preparation Strategy",
      excerpt: "Comprehensive analysis of the latest changes in UPSC Prelims pattern and effective preparation strategies for aspirants.",
      author: "Dr. Rajesh Kumar",
      date: "2024-01-15",
      readTime: "8 min read",
      category: "UPSC",
      image: "/api/placeholder/400/250"
    },
    {
      id: 2,
      title: "MPSC State Service: Complete Syllabus Breakdown",
      excerpt: "Detailed breakdown of MPSC State Service syllabus with subject-wise preparation tips and important topics.",
      author: "Prof. Priya Sharma",
      date: "2024-01-12",
      readTime: "12 min read",
      category: "MPSC",
      image: "/api/placeholder/400/250"
    },
    {
      id: 3,
      title: "Current Affairs Strategy for Civil Services",
      excerpt: "Master the art of current affairs preparation with our proven methodology and recommended sources.",
      author: "Amit Verma",
      date: "2024-01-10",
      readTime: "6 min read",
      category: "Strategy",
      image: "/api/placeholder/400/250"
    },
    {
      id: 4,
      title: "Essay Writing Techniques for UPSC Mains",
      excerpt: "Learn the essential techniques and structure for writing high-scoring essays in UPSC Mains examination.",
      author: "Dr. Meera Joshi",
      date: "2024-01-08",
      readTime: "10 min read",
      category: "UPSC",
      image: "/api/placeholder/400/250"
    },
    {
      id: 5,
      title: "Time Management During Civil Services Preparation",
      excerpt: "Effective time management strategies to balance preparation, revision, and practice tests efficiently.",
      author: "Suresh Patel",
      date: "2024-01-05",
      readTime: "7 min read",
      category: "Strategy",
      image: "/api/placeholder/400/250"
    },
    {
      id: 6,
      title: "MPSC Engineering Services: Technical Preparation Guide",
      excerpt: "Complete guide for MPSC Engineering Services preparation with focus on technical subjects and interview tips.",
      author: "Er. Vikash Singh",
      date: "2024-01-03",
      readTime: "15 min read",
      category: "MPSC",
      image: "/api/placeholder/400/250"
    }
  ];

  const categories = ["All", "UPSC", "MPSC", "Strategy", "Interview"];

  const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category_name === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Civil Services <span className="text-blue-600">Blog</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Expert insights, preparation strategies, and success stories to guide your civil services journey
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full border transition-colors ${
                  activeCategory === category
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 text-lg">Loading blog posts...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {filteredPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                  <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    {/* Image Container - Optimized for 2000x1000 images */}
                    <div className="relative overflow-hidden" style={{ aspectRatio: '2/1' }}>
                      {post.featured_image ? (
                        <img 
                          src={post.featured_image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl mb-2">📚</div>
                            <span className="text-gray-500 text-sm font-medium">Blog Article</span>
                          </div>
                        </div>
                      )}
                      {/* Gradient overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 line-clamp-3 mb-6 text-lg leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      {/* Read More Button */}
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                          <span>Read Article</span>
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                        
                        {/* Reading indicator */}
                        <div className="flex items-center text-gray-400">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-sm">{post.read_time || '5'} min</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
          
          {/* Empty State */}
          {!loading && filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try selecting a different category or check back later for new content.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                <span className="text-2xl">✉️</span>
              </div>
            </div>
            <h3 className="text-4xl font-bold text-white mb-6">
              Stay Ahead in Your Preparation
            </h3>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Get expert insights, study strategies, and the latest updates delivered directly to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl border-0 focus:ring-4 focus:ring-white/30 text-lg shadow-lg"
              />
              <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Subscribe
              </button>
            </div>
            <p className="text-blue-200 text-sm mt-4">Join 10,000+ aspirants already subscribed</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;