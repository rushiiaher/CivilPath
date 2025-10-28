-- Fix image storage fields to handle base64 data
ALTER TABLE blog_posts 
ALTER COLUMN featured_image TYPE TEXT;

-- Also update file_uploads table to handle longer paths
ALTER TABLE file_uploads 
ALTER COLUMN file_path TYPE TEXT;

-- Update blog_images table to handle base64 URLs
ALTER TABLE blog_images 
ALTER COLUMN image_url TYPE TEXT;