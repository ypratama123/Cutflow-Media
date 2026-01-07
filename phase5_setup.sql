-- =============================================
-- PHASE 5: PROJECT & FILE SHARING
-- =============================================

-- 10. Buat tabel projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'review', 'revision', 'completed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Buat tabel project_files
CREATE TABLE IF NOT EXISTS public.project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  uploader_id UUID REFERENCES public.profiles(id),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT CHECK (file_type IN ('raw', 'result', 'doc')),
  file_size BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS untuk projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Customer bisa lihat project miliknya (via order -> user_id)
CREATE POLICY "Users view own projects" 
  ON public.projects FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = projects.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Admin full access projects
CREATE POLICY "Admin full access projects" 
  ON public.projects FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- RLS untuk project_files
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view/insert own project files" 
  ON public.project_files FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      JOIN public.orders ON orders.id = projects.order_id
      WHERE projects.id = project_files.project_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin full access files" 
  ON public.project_files FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- TRIGGER: Auto-create project saat Order status -> 'processing'
CREATE OR REPLACE FUNCTION public.handle_order_processing()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'processing' AND OLD.status != 'processing' THEN
    INSERT INTO public.projects (order_id, title, status, progress)
    SELECT 
      NEW.id, 
      'Project #' || NEW.order_number, -- Default title
      'active',
      0
    WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE order_id = NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_order_processing ON public.orders;
CREATE TRIGGER on_order_processing
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_order_processing();

-- Catatan:
-- Jangan lupa buat BUCKET 'project-files' di Storage menu Supabase.
-- Set Public: NO (Private), tapi RLS policy 'Authenticated Insert/Select'.
