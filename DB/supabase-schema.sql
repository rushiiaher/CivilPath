-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin users table
CREATE TABLE admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exams table (Main exams like UPSC, MPSC, etc.)
CREATE TABLE exams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100),
    image VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exam info sections (Eligibility, Pattern, Syllabus, etc.)
CREATE TABLE exam_info_sections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    section_type VARCHAR(50) NOT NULL, -- 'eligibility', 'pattern', 'syllabus', 'dates', 'notification'
    title VARCHAR(255) NOT NULL,
    content TEXT,
    order_index INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exam stages (Prelims, Mains, Optional, Interview)
CREATE TABLE exam_stages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- 'Prelims', 'Mains', 'Optional', 'Interview'
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subjects/Topics within each stage
CREATE TABLE subjects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES exam_stages(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resource types (PDF, Books, Videos, etc.)
CREATE TABLE resource_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- 'PDF', 'Book', 'Video', 'Audio', 'Link'
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources table (PDFs, Books, Videos, etc.)
CREATE TABLE resources (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES exam_stages(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    resource_type_id UUID REFERENCES resource_types(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(500),
    file_size BIGINT, -- in bytes
    external_url VARCHAR(500),
    author VARCHAR(255),
    publisher VARCHAR(255),
    year VARCHAR(10),
    language VARCHAR(50) DEFAULT 'English',
    tags TEXT[],
    download_count INTEGER DEFAULT 0,
    is_premium BOOLEAN DEFAULT FALSE,
    price DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog categories table
CREATE TABLE blog_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6', -- hex color
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    author VARCHAR(100),
    category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
    featured_image VARCHAR(255),
    images TEXT[], -- Array of image URLs
    read_time INTEGER DEFAULT 5,
    views INTEGER DEFAULT 0,
    tags TEXT[],
    meta_title VARCHAR(255),
    meta_description TEXT,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'archived'
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog images table
CREATE TABLE blog_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    caption TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File uploads tracking
CREATE TABLE file_uploads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_exams_status ON exams(status);
CREATE INDEX idx_exams_category ON exams(category);
CREATE INDEX idx_exam_info_sections_exam_id ON exam_info_sections(exam_id);
CREATE INDEX idx_exam_stages_exam_id ON exam_stages(exam_id);
CREATE INDEX idx_subjects_exam_id ON subjects(exam_id);
CREATE INDEX idx_subjects_stage_id ON subjects(stage_id);
CREATE INDEX idx_resources_exam_id ON resources(exam_id);
CREATE INDEX idx_resources_stage_id ON resources(stage_id);
CREATE INDEX idx_resources_subject_id ON resources(subject_id);
CREATE INDEX idx_resources_type_id ON resources(resource_type_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);

-- Create unique constraints
CREATE UNIQUE INDEX idx_exam_stages_exam_slug ON exam_stages(exam_id, slug);
CREATE UNIQUE INDEX idx_subjects_stage_slug ON subjects(stage_id, slug);
CREATE UNIQUE INDEX idx_exam_info_exam_type ON exam_info_sections(exam_id, section_type);

-- Insert default resource types
INSERT INTO resource_types (name, slug, icon) VALUES
('PDF Document', 'pdf', 'file-pdf'),
('E-Book', 'ebook', 'book'),
('Video Lecture', 'video', 'play-circle'),
('Audio Lecture', 'audio', 'volume-2'),
('External Link', 'link', 'external-link'),
('Practice Test', 'test', 'clipboard-check'),
('Notes', 'notes', 'file-text'),
('Previous Papers', 'previous-papers', 'archive'),
('Syllabus', 'syllabus', 'book-open');

-- Insert default blog categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
('Current Affairs', 'current-affairs', 'Latest current affairs and news', '#EF4444'),
('Study Tips', 'study-tips', 'Tips and strategies for exam preparation', '#10B981'),
('Exam Updates', 'exam-updates', 'Latest exam notifications and updates', '#3B82F6'),
('Success Stories', 'success-stories', 'Success stories of candidates', '#F59E0B'),
('General Knowledge', 'general-knowledge', 'General knowledge articles', '#8B5CF6'),
('Interview Preparation', 'interview-preparation', 'Interview tips and preparation', '#EC4899');