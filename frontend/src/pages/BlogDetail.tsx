import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Facebook, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import { apiService, BlogPost } from '../services/api';

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadBlogPost();
    }
  }, [slug]);

  const loadBlogPost = async () => {
    try {
      // Get all posts and find by slug
      const response = await apiService.getBlogPosts();
      const foundPost = response.records?.find(p => p.slug === slug);
      
      if (foundPost) {
        setPost(foundPost);
        
        // Load related posts from same category
        const related = response.records?.filter(p => 
          p.category_id === foundPost.category_id && p.id !== foundPost.id
        ).slice(0, 3) || [];
        setRelatedPosts(related);
      }
    } catch (error) {
      console.error('Error loading blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const sharePost = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || '';
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <Link to="/blog" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/blog" 
            className="inline-flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Articles
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative">
        {post.featured_image ? (
          <div className="relative h-[70vh] overflow-hidden">
            <img 
              src={post.featured_image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute inset-0 flex items-end">
              <div className="container mx-auto px-4 pb-16">
                <div className="max-w-4xl">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {post.title}
                  </h1>
                  <div className="flex items-center text-white/90 gap-8 text-lg">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      <span>{post.read_time} min read</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>{new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                  {post.title}
                </h1>
                <div className="flex justify-center items-center text-gray-600 gap-8 text-lg">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>{post.read_time} min read</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>{new Date(post.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Article Content */}
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Author Section */}
            <div className="flex items-center mb-12 p-8 bg-gray-50 rounded-3xl">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mr-6">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Written by {post.author}</h3>
                <p className="text-gray-600">Civil Services Expert & Mentor</p>
              </div>
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <div className="mb-12 p-8 bg-blue-50 rounded-3xl border-l-4 border-blue-600">
                <blockquote className="text-2xl text-gray-800 leading-relaxed font-medium italic">
                  "{post.excerpt}"
                </blockquote>
              </div>
            )}

            {/* Main Content */}
            <article className="prose prose-xl max-w-none">
              <div 
                className="text-gray-700 leading-relaxed"
                style={{
                  fontSize: '1.125rem',
                  lineHeight: '1.8',
                }}
                dangerouslySetInnerHTML={{ 
                  __html: post.content.replace(/\n/g, '<br><br>') 
                }} 
              />
            </article>

            {/* Image Gallery */}
            {post.images && post.images.length > 0 && (
              <section className="mt-20">
                <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Visual Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {post.images.map((image, index) => (
                    <div key={index} className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                      <img 
                        src={image} 
                        alt={`Resource ${index + 1}`}
                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Share Section */}
            <section className="mt-20 pt-12 border-t border-gray-200">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Found this helpful? Share it!</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => sharePost('facebook')}
                    className="flex items-center px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Facebook className="w-5 h-5 mr-3" />
                    Share on Facebook
                  </button>
                  <button
                    onClick={() => sharePost('twitter')}
                    className="flex items-center px-8 py-4 bg-sky-500 text-white rounded-2xl hover:bg-sky-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Twitter className="w-5 h-5 mr-3" />
                    Share on Twitter
                  </button>
                  <button
                    onClick={() => sharePost('linkedin')}
                    className="flex items-center px-8 py-4 bg-blue-700 text-white rounded-2xl hover:bg-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Linkedin className="w-5 h-5 mr-3" />
                    Share on LinkedIn
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Continue Your Learning Journey</h2>
                <p className="text-xl text-gray-600">Explore more expert insights and strategies</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {relatedPosts.map((relatedPost) => (
                  <Link 
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3"
                  >
                    <div className="relative overflow-hidden" style={{ aspectRatio: '2/1' }}>
                      {relatedPost.featured_image ? (
                        <img 
                          src={relatedPost.featured_image} 
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl mb-2">📚</div>
                            <span className="text-gray-500 font-medium">Article</span>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-3 mb-6 leading-relaxed">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">Read Article</span>
                        <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogDetail;