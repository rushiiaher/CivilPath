const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

export interface Exam {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  image?: string;
  eligibility?: string;
  exam_pattern?: string;
  syllabus?: string;
  notification_url?: string;
  application_dates?: string;
  exam_dates?: string;
  status: string;
}

export interface Resource {
  id: string;
  exam_id: string;
  category_id: string;
  title: string;
  description: string;
  file_path: string;
  file_type: string;
  tags: string[];
  year?: string;
  download_count: number;
  exam_name?: string;
  category_name?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category_id: string;
  category_name?: string;
  featured_image?: string;
  read_time: number;
  status: string;
  created_at: string;
}

export interface ResourceCategory {
  id: string;
  exam_id: string;
  exam_name?: string;
  name: string;
  slug: string;
  description: string;
  status: string;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`);
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`API Response for ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error(`API Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Exams API
  async getExams(): Promise<{ records: Exam[] }> {
    return this.request('exams');
  }

  async getExam(id: string): Promise<Exam> {
    return this.request(`exams?id=${id}`);
  }

  // Resources API
  async getResources(): Promise<{ records: Resource[] }> {
    return this.request('resources');
  }

  async getResourcesByExam(examId: string): Promise<{ records: Resource[] }> {
    return this.request(`resources?exam_id=${examId}`);
  }

  async getResource(id: string): Promise<Resource> {
    return this.request(`resources?id=${id}`);
  }

  // Blog API
  async getBlogPosts(): Promise<{ records: BlogPost[] }> {
    return this.request('blog');
  }

  async getBlogPost(id: string): Promise<BlogPost> {
    return this.request(`blog?id=${id}`);
  }

  async getBlogPostsByCategory(categoryId: string): Promise<{ records: BlogPost[] }> {
    return this.request(`blog?category_id=${categoryId}`);
  }

  // Categories API
  async getResourceCategories(): Promise<{ records: ResourceCategory[] }> {
    return this.request('categories');
  }

  async getResourceCategoriesByExam(examId: string): Promise<{ records: ResourceCategory[] }> {
    return this.request(`categories?exam_id=${examId}`);
  }

  async getResourceCategory(id: string): Promise<ResourceCategory> {
    return this.request(`categories?id=${id}`);
  }

  // Exam Info API (can be implemented later if needed)
  async getExamInfo(examId: string): Promise<{ records: any[] }> {
    return this.request(`exams?id=${examId}`);
  }

  async getExamInfoByType(examId: string, type: string): Promise<{ records: any[] }> {
    return this.request(`exams?id=${examId}&type=${type}`);
  }
}

export const apiService = new ApiService();