-- Safe SQL Setup Script

-- Create restaurants table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.restaurants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT,
  rating DECIMAL(2,1),
  delivery_time TEXT,
  cuisines TEXT[],
  is_veg BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create food_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.food_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  address TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create or Replace the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Sample Data (Ignore if already exists)
INSERT INTO public.restaurants (name, image, rating, delivery_time, cuisines, is_veg)
SELECT 'Burger King', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add', 4.2, '25-30 min', ARRAY['Burgers', 'Fast Food'], false
WHERE NOT EXISTS (SELECT 1 FROM public.restaurants WHERE name = 'Burger King');

INSERT INTO public.restaurants (name, image, rating, delivery_time, cuisines, is_veg)
SELECT 'Pizza Hut', 'https://images.unsplash.com/photo-1513104890138-7c749659a591', 4.5, '30-40 min', ARRAY['Pizza', 'Italian'], true
WHERE NOT EXISTS (SELECT 1 FROM public.restaurants WHERE name = 'Pizza Hut');

-- Enable RLS on the orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own orders
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
CREATE POLICY "Users can insert their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to see their own orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

-- Insert sample food items for Burger King
INSERT INTO public.food_items (restaurant_id, name, price, description, image, category)
SELECT id, 'Whopper Junior', 12.00, 'Flame-grilled beef patty topped with tomatoes, fresh lettuce, mayo, ketchup, crunchy pickles, and sliced white onions.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', 'Recommended'
FROM public.restaurants WHERE name = 'Burger King'
AND NOT EXISTS (SELECT 1 FROM public.food_items WHERE name = 'Whopper Junior');

INSERT INTO public.food_items (restaurant_id, name, price, description, image, category)
SELECT id, 'French Fries', 5.00, 'Our Great Tasting Fries are thickly cut and fried to a golden brown.', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877', 'Sides'
FROM public.restaurants WHERE name = 'Burger King'
AND NOT EXISTS (SELECT 1 FROM public.food_items WHERE name = 'French Fries');

-- Insert sample food items for Pizza Hut
INSERT INTO public.food_items (restaurant_id, name, price, description, image, category)
SELECT id, 'Margherita Pizza', 18.00, 'Classic delight with 100% real mozzarella cheese.', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3', 'Recommended'
FROM public.restaurants WHERE name = 'Pizza Hut'
AND NOT EXISTS (SELECT 1 FROM public.food_items WHERE name = 'Margherita Pizza');

INSERT INTO public.food_items (restaurant_id, name, price, description, image, category)
SELECT id, 'Garlic Bread', 8.00, 'Freshly baked garlic bread with cheese.', 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c', 'Sides'
FROM public.restaurants WHERE name = 'Pizza Hut'
AND NOT EXISTS (SELECT 1 FROM public.food_items WHERE name = 'Garlic Bread');
