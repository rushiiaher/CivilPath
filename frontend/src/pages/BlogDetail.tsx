import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
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

      {/* Article Header */}
      <article className="bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                {post.category_name || 'General'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center text-gray-600 mb-8 gap-6">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{post.read_time} min read</span>
              </div>
            </div>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="mb-8">
                <img 
                  src={post.featured_image} 
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Excerpt */}
            {post.excerpt && (
              <div className="text-xl text-gray-700 leading-relaxed mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-600">
                {post.excerpt}
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Article Content */}
      <div className="bg-white">
        <div className="container mx-auto px-4 pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: post.content.replace(/\n/g, '<br>') 
                }} 
              />
            </div>

            {/* Additional Images */}
            {post.images && post.images.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Related Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {post.images.map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`Related image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Share this article</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => sharePost('facebook')}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => sharePost('twitter')}
                    className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => sharePost('linkedin')}
                    className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link 
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                      {relatedPost.featured_image ? (
                        <img 
                          src={relatedPost.featured_image} 
                          alt={relatedPost.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">📝 Blog Image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <div className="mt-4 text-xs text-gray-500">
                        {new Date(relatedPost.created_at).toLocaleDateString()}
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