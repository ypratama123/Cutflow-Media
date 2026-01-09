-- 1. FIX ADMIN ROLE
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'cutflowmediaa@gmail.com';

-- 2. VERIFY
SELECT * FROM profiles WHERE email = 'cutflowmediaa@gmail.com';
