-- =============================================
-- FIX 1: ADMIN ACCESS TO ORDERS
-- Masalah: Admin tidak bisa melihat pesanan user lain karena RLS memblokir.
-- =============================================

-- Drop policies lama jika ada (optional, untuk safety)
-- DROP POLICY IF EXISTS "Admin can view all orders" ON public.orders;

-- 1. Policy agar Admin bisa MELIHAT semua order
CREATE POLICY "Admin can view all orders" 
  ON public.orders FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- 2. Policy agar Admin bisa EDIT order (update status/payment)
CREATE POLICY "Admin can update all orders" 
  ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- =============================================
-- FIX 2: ADMIN ACCESS TO PROFILES
-- Agar Admin bisa melihat nama customer di list order
-- =============================================

CREATE POLICY "Admin can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
