-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, featured_image, read_time, status) 
SELECT 
    'UPSC Prelims 2024: Key Changes and Updates',
    'upsc-prelims-2024-key-changes',
    'Important changes in UPSC Prelims 2024 pattern and syllabus that every aspirant should know.',
    '<h2>UPSC Prelims 2024: What''s New?</h2><p>The Union Public Service Commission has announced several key changes for the Civil Services Preliminary Examination 2024. Here are the most important updates:</p><h3>Pattern Changes</h3><ul><li>Increased emphasis on current affairs</li><li>More questions from environment and ecology</li><li>Updated syllabus for science and technology</li></ul><h3>Preparation Strategy</h3><p>Candidates should focus on recent developments in government policies, international relations, and technological advancements.</p>',
    'Admin',
    bc.id,
    '/uploads/upsc-prelims-2024.jpg',
    8,
    'published'
FROM blog_categories bc WHERE bc.slug = 'exam-updates';

INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, featured_image, read_time, status) 
SELECT 
    'Top 10 Study Tips for Civil Services Preparation',
    'top-10-study-tips-civil-services',
    'Proven strategies and techniques to maximize your preparation efficiency for civil services examinations.',
    '<h2>Essential Study Tips for Success</h2><p>Preparing for civil services requires a systematic approach. Here are the top 10 tips:</p><ol><li><strong>Create a Study Schedule</strong> - Plan your daily routine</li><li><strong>Focus on NCERT Books</strong> - Build strong fundamentals</li><li><strong>Read Newspapers Daily</strong> - Stay updated with current affairs</li><li><strong>Practice Answer Writing</strong> - Essential for mains preparation</li><li><strong>Take Mock Tests</strong> - Assess your preparation level</li></ol>',
    'Admin',
    bc.id,
    '/uploads/study-tips.jpg',
    12,
    'published'
FROM blog_categories bc WHERE bc.slug = 'study-tips';

INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, featured_image, read_time, status) 
SELECT 
    'MPSC State Services: Complete Guide 2024',
    'mpsc-state-services-guide-2024',
    'Comprehensive guide covering eligibility, syllabus, and preparation strategy for MPSC State Services.',
    '<h2>MPSC State Services Overview</h2><p>Maharashtra Public Service Commission conducts various examinations for state government positions.</p><h3>Eligibility Criteria</h3><ul><li>Age: 19-38 years</li><li>Education: Graduate degree</li><li>Domicile: Maharashtra resident</li></ul><h3>Exam Pattern</h3><p>The examination consists of Prelims, Mains, and Interview rounds.</p>',
    'Admin',
    bc.id,
    '/uploads/mpsc-guide.jpg',
    10,
    'published'
FROM blog_categories bc WHERE bc.slug = 'exam-updates';

INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, featured_image, read_time, status) 
SELECT 
    'Success Story: From Failure to IAS Officer',
    'success-story-failure-to-ias',
    'Inspiring journey of an aspirant who overcame multiple failures to become an IAS officer.',
    '<h2>Never Give Up: A Success Story</h2><p>Meet Priya Sharma, who failed UPSC three times before finally clearing it in her fourth attempt.</p><h3>The Journey</h3><p>Priya''s journey was filled with challenges, but her determination never wavered. She shares her experience and tips for other aspirants.</p><blockquote>"Failure is not the opposite of success, it''s part of success."</blockquote>',
    'Admin',
    bc.id,
    '/uploads/success-story.jpg',
    15,
    'published'
FROM blog_categories bc WHERE bc.slug = 'success-stories';

INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, featured_image, read_time, status) 
SELECT 
    'Current Affairs January 2024: Monthly Compilation',
    'current-affairs-january-2024',
    'Important current affairs topics from January 2024 for civil services preparation.',
    '<h2>January 2024 Current Affairs</h2><h3>National News</h3><ul><li>Budget 2024 highlights</li><li>New government schemes launched</li><li>Policy updates and amendments</li></ul><h3>International News</h3><ul><li>Global economic trends</li><li>International agreements</li><li>Geopolitical developments</li></ul>',
    'Admin',
    bc.id,
    '/uploads/current-affairs-jan.jpg',
    20,
    'published'
FROM blog_categories bc WHERE bc.slug = 'current-affairs';

INSERT INTO blog_posts (title, slug, excerpt, content, author, category_id, featured_image, read_time, status) 
SELECT 
    'Interview Preparation: Do''s and Don''ts',
    'interview-preparation-dos-donts',
    'Essential tips and guidelines for civil services interview preparation and personality test.',
    '<h2>Cracking the Civil Services Interview</h2><p>The interview is the final hurdle in your civil services journey. Here''s how to prepare:</p><h3>Do''s</h3><ul><li>Be honest and authentic</li><li>Stay updated with current affairs</li><li>Practice mock interviews</li><li>Maintain good body language</li></ul><h3>Don''ts</h3><ul><li>Don''t memorize answers</li><li>Avoid controversial topics</li><li>Don''t argue with the panel</li></ul>',
    'Admin',
    bc.id,
    '/uploads/interview-prep.jpg',
    14,
    'published'
FROM blog_categories bc WHERE bc.slug = 'interview-preparation';

-- Insert sample resources for each exam
DO $$
DECLARE
    exam_record RECORD;
    category_record RECORD;
BEGIN
    FOR exam_record IN SELECT id, name FROM exams LOOP
        FOR category_record IN SELECT id, name FROM resource_categories WHERE exam_id = exam_record.id LOOP
            INSERT INTO resources (exam_id, category_id, title, description, file_path, file_type, tags, year, download_count) VALUES
            (exam_record.id, category_record.id, 
             exam_record.name || ' - ' || category_record.name || ' Study Material', 
             'Comprehensive study material for ' || category_record.name || ' preparation',
             '/uploads/sample-' || lower(replace(category_record.name, ' ', '-')) || '.pdf',
             'pdf',
             ARRAY[lower(replace(exam_record.name, ' ', '-')), lower(replace(category_record.name, ' ', '-'))],
             '2024',
             FLOOR(RANDOM() * 100) + 10),
            (exam_record.id, category_record.id,
             exam_record.name || ' - ' || category_record.name || ' Previous Papers',
             'Previous year question papers with solutions',
             '/uploads/previous-papers-' || lower(replace(category_record.name, ' ', '-')) || '.pdf',
             'pdf',
             ARRAY['previous-papers', lower(replace(category_record.name, ' ', '-'))],
             '2023',
             FLOOR(RANDOM() * 150) + 20);
        END LOOP;
    END LOOP;
END $$;