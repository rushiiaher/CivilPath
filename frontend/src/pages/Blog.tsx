import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
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

  const categories = [
    "All",
    "Indian Polity", 
    "Current Affairs",
    "UPSC Prelims Exam",
    "Environment & Ecology",
    "UPSC Preparation Tips",
    "Economy",
    "UPSC Mains Exam",
    "Physical Geography",
    "UPSC Toppers",
    "Join Us",
    "Result",
    "Indian History",
    "UPSC Interview Guidance"
  ];

  const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category_name === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Civil Services <span className="text-blue-600">Blog</span>
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  Category
                  <div className="flex-1 h-px bg-gray-300 ml-4"></div>
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        activeCategory === category
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading articles...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex gap-6">
                        {/* Image */}
                        <div className="w-48 h-32 flex-shrink-0">
                          {post.featured_image ? (
                            <img 
                              src={post.featured_image} 
                              alt={post.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                              <span className="text-gray-500 text-sm">📰</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                            {post.title}
                          </h2>
                          
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{new Date(post.created_at).toLocaleDateString('en-GB', {
                              weekday: 'short',
                              day: '2-digit',
                              month: '2-digit', 
                              year: 'numeric'
                            }).replace(/\//g, '-')} {new Date(post.created_at).toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}</span>
                          </div>

                          <p className="text-gray-600 line-clamp-2 mb-4">
                            {post.excerpt}
                          </p>

                          <Link 
                            to={`/blog/${post.slug}`}
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}

                {filteredPosts.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                    <p className="text-gray-600">Try selecting a different category.</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Blog;