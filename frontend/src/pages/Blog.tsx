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
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading blog posts...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {post.featured_image ? (
                      <img 
                        src={post.featured_image} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center ${post.featured_image ? 'hidden' : ''}`}>
                      <span className="text-gray-500 text-sm">Blog Image</span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                        {post.category_name || 'General'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <User className="w-4 h-4 mr-1" />
                      <span className="mr-4">{post.author}</span>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{post.read_time} min read</span>
                      <Calendar className="w-4 h-4 ml-4 mr-1" />
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    
                    {/* Additional images preview */}
                    {post.images && post.images.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        {post.images.slice(0, 3).map((image, index) => (
                          <div key={index} className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                            <img 
                              src={image} 
                              alt={`Image ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        ))}
                        {post.images.length > 3 && (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">+{post.images.length - 3}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                    >
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Stay Updated with Latest Articles
            </h3>
            <p className="text-blue-100 mb-8">
              Get the latest preparation tips, strategies, and success stories delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white/50"
              />
              <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;