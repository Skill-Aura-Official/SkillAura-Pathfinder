ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS theme text DEFAULT 'ocean';

INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false) ON CONFLICT DO NOTHING;

CREATE POLICY "Users can upload own resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can read own resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);
