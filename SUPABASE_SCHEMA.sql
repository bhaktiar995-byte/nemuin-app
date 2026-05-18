-- DATABASE SCHEMA UNTUK SUPABASE
-- Silahkan copy paste di SQL Editor Supabase Anda

-- 1. Table Restaurants
CREATE TABLE IF NOT EXISTS restaurants (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  type TEXT,
  address TEXT,
  price_range TEXT,
  phone TEXT,
  hours TEXT,
  lat FLOAT,
  lng FLOAT,
  image TEXT,
  distance TEXT,
  rating FLOAT DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_available_online BOOLEAN DEFAULT true
);

-- 2. Table Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  restaurant_id BIGINT REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price INTEGER,
  image TEXT,
  category TEXT
);

-- 3. Table Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  restaurant_id BIGINT REFERENCES restaurants(id) ON DELETE CASCADE,
  user_name TEXT,
  text TEXT,
  rating FLOAT
);

-- 4. Table Services (Drivers/Kurir)
CREATE TABLE IF NOT EXISTS services (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  type TEXT, -- Ojek, Taxi, Kurir, Food Delivery
  phone TEXT,
  lat FLOAT,
  lng FLOAT,
  status TEXT DEFAULT 'active',
  image TEXT
);

-- 5. Table Posts
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  content TEXT,
  image TEXT,
  author TEXT,
  date TIMESTAMPTZ DEFAULT NOW()
);

-- AKTIFKAN RLS (Opsional: Matikan untuk testing atau buat kebijakan)
-- ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public insert" ON restaurants FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow public select" ON restaurants FOR SELECT USING (true);
-- Lakukan hal yang sama untuk tabel lain jika perlu.
