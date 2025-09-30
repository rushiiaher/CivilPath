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

-- Exams table
CREATE TABLE exams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100),
    image VARCHAR(255),
    eligibility TEXT,
    exam_pattern TEXT,
    syllabus TEXT,
    notification_url VARCHAR(255),
    application_dates VARCHAR(255),
    exam_dates VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resource categories table
CREATE TABLE resource_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources table
CREATE TABLE resources (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    category_id UUID REFERENCES resource_categories(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(255),
    file_type VARCHAR(50),
    tags TEXT[],
    year VARCHAR(10),
    download_count INTEGER DEFAULT 0,
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
    read_time INTEGER DEFAULT 5,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_exams_status ON exams(status);
CREATE INDEX idx_exams_category ON exams(category);
CREATE INDEX idx_resources_exam_id ON resources(exam_id);
CREATE INDEX idx_resources_category_id ON resources(category_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_category_id ON blog_posts(category_id);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, password, email) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@civilpath.com');

-- Insert sample data
INSERT INTO exams (name, slug, description, category, status) VALUES
('UPSC Civil Services', 'upsc-civil-services', 'Union Public Service Commission Civil Services Examination', 'Central Government', 'active'),
('MPSC State Services', 'mpsc-state-services', 'Maharashtra Public Service Commission State Services', 'State Government', 'active'),
('MPSC Combined Services', 'mpsc-combined-services', 'MPSC Combined Subordinate Services Examination', 'State Government', 'active'),
('MPSC Engineering Services', 'mpsc-engineering-services', 'MPSC Engineering Services Examination', 'Technical Services', 'active'),
('MPSC Agriculture Services', 'mpsc-agriculture-services', 'MPSC Agriculture Services Examination', 'Agriculture Services', 'active');

-- Insert blog categories
INSERT INTO blog_categories (name, slug, description) VALUES
('Current Affairs', 'current-affairs', 'Latest current affairs and news'),
('Study Tips', 'study-tips', 'Tips and strategies for exam preparation'),
('Exam Updates', 'exam-updates', 'Latest exam notifications and updates'),
('Success Stories', 'success-stories', 'Success stories of candidates'),
('General Knowledge', 'general-knowledge', 'General knowledge articles'),
('Interview Preparation', 'interview-preparation', 'Interview tips and preparation');

-- Insert resource categories for each exam
DO $$
DECLARE
    exam_record RECORD;
BEGIN
    FOR exam_record IN SELECT id FROM exams LOOP
        INSERT INTO resource_categories (exam_id, name, slug, description) VALUES
        (exam_record.id, 'Prelims', 'prelims', 'Preliminary examination materials'),
        (exam_record.id, 'Mains', 'mains', 'Main examination materials'),
        (exam_record.id, 'Optional', 'optional', 'Optional subject materials'),
        (exam_record.id, 'Test Series', 'test-series', 'Mock tests and test series'),
        (exam_record.id, 'Current Affairs', 'current-affairs', 'Current affairs materials'),
        (exam_record.id, 'Coaching Material', 'coaching-material', 'Coaching institute materials'),
        (exam_record.id, 'E-books', 'e-books', 'Digital books and PDFs');
    END LOOP;
END $$;