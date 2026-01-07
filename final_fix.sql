-- =============================================
-- FINAL FIX (VERSION 3.0 - RECURSION FIX)
-- JALANKAN DI SUPABASE SQL EDITOR
-- Fixes Error: "infinite recursion detected in policy for relation 'profiles'"
-- =============================================

-- 1. Helper Function: is_admin()
-- SECURITY DEFINER: Bypass RLS untuk menghindari infinite loop saat cek role admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. RESET POLICIES (Bersihkan semua variasi nama policy lama)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Optimized Profile Access" ON public.profiles;
DROP POLICY IF EXISTS "Unified Profile Access" ON public.profiles;
DROP POLICY IF EXISTS "Profiles access" ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles update own" ON public.profiles;

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users create orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admin view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Admin update all orders" ON public.orders;

-- 3. ENABLE RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. POLICY PROFILES (Fix Infinite Recursion)
CREATE POLICY "Profiles access" 
  ON public.profiles FOR SELECT 
  USING (
    auth.uid() = id       -- User baca sendiri
    OR 
    public.is_admin()     -- Admin baca semua (via function aman)
  );

CREATE POLICY "Profiles update own" 
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 5. POLICY ORDERS
-- User lihat ordernya sendiri
CREATE POLICY "Users view own orders" 
  ON public.orders FOR SELECT 
  USING (auth.uid() = user_id);

-- Admin lihat SEMUA order (Gunakan is_admin() biar aman & cepat)
CREATE POLICY "Admin view all orders" 
  ON public.orders FOR SELECT 
  USING (public.is_admin());

-- Admin edit SEMUA order
CREATE POLICY "Admin update all orders" 
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- 6. PASTIKAN CUTFLOW MEDIA JADI ADMIN
UPDATE public.profiles SET role = 'admin' WHERE email = 'cutflowmediaa@gmail.com';

-- 7. FIX MISSING PROFILES (Safe)
INSERT INTO public.profiles (id, email, role, full_name, created_at)
SELECT 
  id, 
  email, 
  'customer', 
  COALESCE(raw_user_meta_data->>'full_name', SPLIT_PART(email, '@', 1)),
  created_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;
