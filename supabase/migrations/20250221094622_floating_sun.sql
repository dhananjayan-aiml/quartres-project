/*
  # Initial Schema for Quarters Management System

  1. New Tables
    - `profiles`
      - Faculty profile information linked to auth.users
    - `quarters`
      - Available quarters/flats information
    - `bookings`
      - Quarters booking requests and allocations
    - `maintenance_requests`
      - Maintenance complaints and tracking
    - `services`
      - Available services (laundry, cook, cleaning)
    - `service_bookings`
      - Service booking records
    - `utility_bills`
      - Electricity and water bill records
    - `products`
      - Mini mart/grocery products
    - `orders`
      - Shopping orders

  2. Security
    - Enable RLS on all tables
    - Add policies for faculty and admin access
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  full_name text,
  department text,
  employee_id text UNIQUE,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Quarters/Flats table
CREATE TABLE IF NOT EXISTS quarters (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  block_name text NOT NULL,
  flat_number text NOT NULL,
  type text NOT NULL, -- 1BHK, 2BHK, etc.
  floor_number integer NOT NULL,
  monthly_rent decimal NOT NULL,
  status text DEFAULT 'available', -- available, occupied, maintenance
  features jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(block_name, flat_number)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  quarter_id uuid REFERENCES quarters(id),
  faculty_id uuid REFERENCES profiles(id),
  status text DEFAULT 'pending', -- pending, approved, rejected, cancelled
  move_in_date date,
  approved_by uuid REFERENCES profiles(id),
  approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Maintenance Requests table
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  quarter_id uuid REFERENCES quarters(id),
  faculty_id uuid REFERENCES profiles(id),
  issue_type text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'pending', -- pending, in_progress, completed
  priority text DEFAULT 'normal', -- low, normal, high, urgent
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  type text NOT NULL, -- laundry, cook, cleaning
  description text,
  price decimal NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Service Bookings table
CREATE TABLE IF NOT EXISTS service_bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id uuid REFERENCES services(id),
  faculty_id uuid REFERENCES profiles(id),
  booking_date date NOT NULL,
  time_slot text,
  status text DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Utility Bills table
CREATE TABLE IF NOT EXISTS utility_bills (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  quarter_id uuid REFERENCES quarters(id),
  faculty_id uuid REFERENCES profiles(id),
  bill_type text NOT NULL, -- electricity, water
  bill_date date NOT NULL,
  amount decimal NOT NULL,
  due_date date NOT NULL,
  status text DEFAULT 'unpaid', -- unpaid, paid
  payment_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  price decimal NOT NULL,
  stock_quantity integer NOT NULL DEFAULT 0,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  faculty_id uuid REFERENCES profiles(id),
  status text DEFAULT 'pending', -- pending, confirmed, delivered, cancelled
  total_amount decimal NOT NULL,
  delivery_address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id),
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  unit_price decimal NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quarters ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE utility_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read all profiles but only update their own
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Quarters: Anyone can view, only admins can modify
CREATE POLICY "Anyone can view quarters"
  ON quarters FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can modify quarters"
  ON quarters FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  ));

-- Bookings: Users can view their own bookings, admins can view all
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (faculty_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (faculty_id = auth.uid());

-- Similar policies for other tables...

-- Create function to handle user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
