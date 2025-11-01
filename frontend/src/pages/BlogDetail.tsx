import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, ArrowRight } from 'lucide-react';
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
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <Link to="/blog" className="text-blue-600 hover:text-blue-700">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/blog" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Featured Image Hero */}
      {post.featured_image && (
        <div className="relative" style={{ aspectRatio: '2/1', maxHeight: '60vh' }}>
          <img 
            src={post.featured_image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                {post.title}
              </h1>
              <div className="flex items-center text-white/90 gap-6">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="text-lg">{post.read_time} min read</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="text-lg">{new Date(post.created_at).toLocaleDateString('en-US', {
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

      {/* Article Header - No Image Case */}
      {!post.featured_image && (
        <article className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                {post.title}
              </h1>
              <div className="flex justify-center items-center text-gray-600 gap-8 mb-8">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="text-lg">{post.read_time} min read</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="text-lg">{new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      )}

      {/* Excerpt Section */}
      {post.excerpt && (
        <div className="bg-blue-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-2xl text-gray-800 leading-relaxed text-center font-medium italic">
                “{post.excerpt}”
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Author Info */}
            <div className="flex items-center mb-12 p-6 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">Written by {post.author}</div>
                <div className="text-gray-600">Civil Services Expert</div>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-xl max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: post.content.replace(/\n/g, '<br>') 
                }} 
              />
            </div>

            {/* Additional Images Gallery */}
            {post.images && post.images.length > 0 && (
              <div className="mt-16">
                <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">Visual Gallery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {post.images.map((image, index) => (
                    <div key={index} className="group cursor-pointer">
                      <img 
                        src={image} 
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-64 object-cover rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Share this article</h3>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => sharePost('facebook')}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <Facebook className="w-5 h-5 mr-2" />
                    Facebook
                  </button>
                  <button
                    onClick={() => sharePost('twitter')}
                    className="flex items-center px-6 py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <Twitter className="w-5 h-5 mr-2" />
                    Twitter
                  </button>
                  <button
                    onClick={() => sharePost('linkedin')}
                    className="flex items-center px-6 py-3 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <Linkedin className="w-5 h-5 mr-2" />
                    LinkedIn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-gradient-to-b from-gray-50 to-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Continue Reading</h2>
                <p className="text-xl text-gray-600">More articles to enhance your preparation</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link 
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="relative overflow-hidden" style={{ aspectRatio: '2/1' }}>
                      {relatedPost.featured_image ? (
                        <img 
                          src={relatedPost.featured_image} 
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl mb-2">📚</div>
                            <span className="text-gray-500 text-sm font-medium">Article</span>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2 mb-4">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 font-semibold group-hover:text-blue-700">Read More</span>
                        <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;