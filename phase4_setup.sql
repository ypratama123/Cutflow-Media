-- =============================================
-- TAMBAHAN PHASE 4: CONTACT & LEADS
-- =============================================

-- 9. Buat tabel contact_submissions
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  project_type TEXT,
  budget_range TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Public can insert (submit form)
CREATE POLICY "Public can insert contact form" 
  ON public.contact_submissions FOR INSERT 
  WITH CHECK (true);

-- Policy: Admin can do anything
CREATE POLICY "Admin full access contact" 
  ON public.contact_submissions FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Catatan: Pastikan Anda sudah menjalankan script sebelumnya.
