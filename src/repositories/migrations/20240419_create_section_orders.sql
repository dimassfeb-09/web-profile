CREATE TABLE IF NOT EXISTS section_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key VARCHAR(50) UNIQUE NOT NULL,
  section_label VARCHAR(100) NOT NULL,
  order_index INTEGER NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data Default
INSERT INTO section_orders (section_key, section_label, order_index) VALUES
  ('about', 'About', 1),
  ('skills', 'Skills', 2),
  ('experience', 'Experience', 3),
  ('projects', 'Projects', 4),
  ('achievements', 'Achievements', 5),
  ('certificates', 'Certificates', 6),
  ('blog', 'Blog', 7),
  ('contact', 'Contact', 8)
ON CONFLICT (section_key) DO NOTHING;
