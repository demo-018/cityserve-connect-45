# CityServe Connect - Backend Developer Guide

## 📋 Table of Contents
1. [Backend Overview](#backend-overview)
2. [Supabase Integration](#supabase-integration)
3. [Database Schema](#database-schema)
4. [API Data Models](#api-data-models)
5. [Authentication System](#authentication-system)
6. [API Endpoints Structure](#api-endpoints-structure)
7. [Data Flow Patterns](#data-flow-patterns)
8. [Integration Guidelines](#integration-guidelines)
9. [Security Best Practices](#security-best-practices)
10. [Development Setup](#development-setup)

## 🏗️ Backend Overview

CityServe Connect uses **Supabase** as the backend-as-a-service solution, providing:
- **PostgreSQL Database** with real-time subscriptions
- **Authentication** with multiple providers
- **Row Level Security (RLS)** for data protection
- **Edge Functions** for custom business logic
- **Storage** for file uploads (images, documents)
- **Real-time subscriptions** for live updates

### Architecture Pattern
```
Frontend (React) ↔ Supabase Client ↔ Supabase Backend
                                   ├── PostgreSQL Database
                                   ├── Auth Service
                                   ├── Storage
                                   └── Edge Functions
```

## 🗄️ Database Schema

### Core Tables Structure

#### 1. Users Table (`profiles`)
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('customer', 'provider', 'admin')) DEFAULT 'customer',
  avatar_url TEXT,
  address TEXT,
  pincode TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. Service Categories Table
```sql
CREATE TABLE service_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  slug TEXT UNIQUE NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. Services Table
```sql
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES service_categories(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration INTEGER, -- in minutes
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4. Service Providers Table (Extended Profile)
```sql
CREATE TABLE service_providers (
  id UUID REFERENCES profiles(id) PRIMARY KEY,
  business_name TEXT,
  experience_years INTEGER,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  hourly_rate DECIMAL(8,2),
  availability_status TEXT CHECK (availability_status IN ('available', 'busy', 'offline')) DEFAULT 'available',
  response_time_minutes INTEGER DEFAULT 60,
  bio TEXT,
  skills TEXT[], -- Array of skills
  certifications TEXT[],
  service_areas TEXT[], -- Array of service areas/pincodes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 5. Bookings Table
```sql
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES profiles(id),
  provider_id UUID REFERENCES profiles(id),
  service_id UUID REFERENCES services(id),
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  customer_address TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  special_instructions TEXT,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
  payment_method TEXT,
  payment_id TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 6. Reviews Table
```sql
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) UNIQUE,
  customer_id UUID REFERENCES profiles(id),
  provider_id UUID REFERENCES profiles(id),
  service_id UUID REFERENCES services(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  helpful_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 7. Provider Availability Table
```sql
CREATE TABLE provider_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES profiles(id),
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📊 API Data Models

### Core TypeScript Interfaces

#### User Profile Response
```typescript
interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: 'customer' | 'provider' | 'admin';
  avatar_url: string | null;
  address: string | null;
  pincode: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
}
```

#### Service Response
```typescript
interface Service {
  id: string;
  provider_id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number | null;
  image_url: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  
  // Joined data
  category?: ServiceCategory;
  provider?: ServiceProvider;
  reviews_avg?: number;
  reviews_count?: number;
}
```

#### Service Provider Response
```typescript
interface ServiceProvider {
  id: string;
  business_name: string | null;
  experience_years: number | null;
  rating: number;
  total_reviews: number;
  hourly_rate: number | null;
  availability_status: 'available' | 'busy' | 'offline';
  response_time_minutes: number;
  bio: string | null;
  skills: string[];
  certifications: string[];
  service_areas: string[];
  created_at: string;
  updated_at: string;
  
  // Joined profile data
  profile?: UserProfile;
  services?: Service[];
}
```

#### Booking Response
```typescript
interface Booking {
  id: string;
  customer_id: string;
  provider_id: string;
  service_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  total_amount: number;
  customer_address: string;
  customer_phone: string;
  special_instructions: string | null;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string | null;
  payment_id: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
  
  // Joined data
  customer?: UserProfile;
  provider?: UserProfile;
  service?: Service;
}
```

#### Review Response
```typescript
interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  provider_id: string;
  service_id: string;
  rating: number;
  comment: string | null;
  helpful_count: number;
  verified: boolean;
  created_at: string;
  
  // Joined data
  customer?: UserProfile;
  booking?: Booking;
}
```

## 🔐 Authentication System

### Auth Flow

#### 1. User Registration
```typescript
// Registration payload
interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  role: 'customer' | 'provider';
  address?: string;
  pincode?: string;
}

// Response
interface AuthResponse {
  user: {
    id: string;
    email: string;
    // ... other auth user fields
  };
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}
```

#### 2. User Login
```typescript
// Login payload
interface LoginData {
  email: string;
  password: string;
}

// Same AuthResponse as registration
```

#### 3. Profile Completion (After Registration)
```typescript
// Profile completion payload
interface ProfileData {
  full_name: string;
  phone: string;
  address: string;
  pincode: string;
  avatar_url?: string;
  
  // Provider-specific fields
  business_name?: string;
  experience_years?: number;
  hourly_rate?: number;
  bio?: string;
  skills?: string[];
  service_areas?: string[];
}
```

### Role-Based Access

#### Row Level Security (RLS) Policies

```sql
-- Users can only view/edit their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Providers can manage their own services
CREATE POLICY "Providers can manage own services" ON services
  FOR ALL USING (auth.uid() = provider_id);

-- Customers can view all active services
CREATE POLICY "Anyone can view active services" ON services
  FOR SELECT USING (active = true);

-- Booking access control
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (
    auth.uid() = customer_id OR 
    auth.uid() = provider_id OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## 🛠️ API Endpoints Structure

### RESTful API Patterns with Supabase

#### 1. Services API
```typescript
// GET /services - List all services with filters
interface GetServicesParams {
  category_id?: string;
  provider_id?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  location?: string;
  page?: number;
  limit?: number;
  sort_by?: 'price' | 'rating' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

interface GetServicesResponse {
  data: Service[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}

// POST /services - Create new service (Provider only)
interface CreateServiceData {
  category_id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image_url?: string;
}

// PUT /services/:id - Update service (Provider only)
interface UpdateServiceData extends Partial<CreateServiceData> {
  active?: boolean;
}
```

#### 2. Bookings API
```typescript
// POST /bookings - Create new booking
interface CreateBookingData {
  provider_id: string;
  service_id: string;
  booking_date: string; // ISO date
  start_time: string;   // HH:mm format
  customer_address: string;
  customer_phone: string;
  special_instructions?: string;
}

interface CreateBookingResponse {
  booking: Booking;
  payment_intent?: {
    client_secret: string;
    amount: number;
  };
}

// GET /bookings - List user's bookings
interface GetBookingsParams {
  status?: Booking['status'];
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

// PATCH /bookings/:id/status - Update booking status
interface UpdateBookingStatusData {
  status: Booking['status'];
  cancellation_reason?: string;
}
```

#### 3. Providers API
```typescript
// GET /providers - List service providers
interface GetProvidersParams {
  service_category?: string;
  location?: string;
  availability_status?: 'available' | 'busy' | 'offline';
  min_rating?: number;
  max_hourly_rate?: number;
  search?: string;
  page?: number;
  limit?: number;
}

interface GetProvidersResponse {
  data: ServiceProvider[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}

// GET /providers/:id - Get provider details
interface GetProviderResponse {
  provider: ServiceProvider;
  services: Service[];
  reviews: Review[];
  availability: ProviderAvailability[];
  stats: {
    total_bookings: number;
    completed_bookings: number;
    average_rating: number;
    response_rate: number;
  };
}
```

#### 4. Reviews API
```typescript
// POST /reviews - Create review (after booking completion)
interface CreateReviewData {
  booking_id: string;
  rating: number; // 1-5
  comment?: string;
}

// GET /reviews - Get reviews for service/provider
interface GetReviewsParams {
  service_id?: string;
  provider_id?: string;
  customer_id?: string;
  min_rating?: number;
  page?: number;
  limit?: number;
}
```

## 🔄 Data Flow Patterns

### 1. Service Booking Flow
```typescript
// Step 1: Get available time slots
GET /providers/:id/availability?date=2024-01-20

// Step 2: Create booking
POST /bookings
{
  provider_id: "uuid",
  service_id: "uuid",
  booking_date: "2024-01-20",
  start_time: "10:00",
  customer_address: "123 Main St",
  customer_phone: "+1234567890"
}

// Step 3: Process payment
POST /payments/process
{
  booking_id: "uuid",
  payment_method: "card",
  amount: 2500
}

// Step 4: Confirm booking
PATCH /bookings/:id/status
{
  status: "confirmed"
}
```

### 2. Real-time Updates
```typescript
// Subscribe to booking updates
supabase
  .channel('bookings')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'bookings',
    filter: `customer_id=eq.${userId}`
  }, (payload) => {
    // Handle booking updates
    console.log('Booking updated:', payload);
  })
  .subscribe();

// Subscribe to new reviews
supabase
  .channel('reviews')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'reviews',
    filter: `provider_id=eq.${providerId}`
  }, (payload) => {
    // Handle new review
    updateProviderRating(payload.new);
  })
  .subscribe();
```

### 3. File Upload Pattern
```typescript
// Upload service image
const uploadServiceImage = async (file: File, serviceId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `services/${serviceId}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('service-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });
    
  if (error) throw error;
  
  // Update service with image URL
  const { data: publicURL } = supabase.storage
    .from('service-images')
    .getPublicUrl(fileName);
    
  await supabase
    .from('services')
    .update({ image_url: publicURL.publicUrl })
    .eq('id', serviceId);
    
  return publicURL.publicUrl;
};
```

## 🔧 Integration Guidelines

### 1. Setting Up Supabase Client

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProfile, 'id'>>;
      };
      services: {
        Row: Service;
        Insert: Omit<Service, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Service, 'id'>>;
      };
      // ... other tables
    };
  };
};
```

### 2. API Service Layer

```typescript
// services/api.ts
import { supabase } from '@/lib/supabase';

export class ServicesAPI {
  static async getServices(params: GetServicesParams = {}) {
    let query = supabase
      .from('services')
      .select(`
        *,
        category:service_categories(*),
        provider:profiles(*),
        reviews(rating)
      `)
      .eq('active', true);

    if (params.category_id) {
      query = query.eq('category_id', params.category_id);
    }

    if (params.search) {
      query = query.ilike('name', `%${params.search}%`);
    }

    if (params.min_price) {
      query = query.gte('price', params.min_price);
    }

    if (params.max_price) {
      query = query.lte('price', params.max_price);
    }

    const { data, error, count } = await query
      .range(
        (params.page || 0) * (params.limit || 10),
        ((params.page || 0) + 1) * (params.limit || 10) - 1
      );

    if (error) throw error;

    return {
      data: data || [],
      count: count || 0,
      page: params.page || 0,
      limit: params.limit || 10,
      total_pages: Math.ceil((count || 0) / (params.limit || 10))
    };
  }

  static async createService(data: CreateServiceData) {
    const { data: service, error } = await supabase
      .from('services')
      .insert({
        ...data,
        provider_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) throw error;
    return service;
  }

  static async updateService(id: string, data: UpdateServiceData) {
    const { data: service, error } = await supabase
      .from('services')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return service;
  }
}

export class BookingsAPI {
  static async createBooking(data: CreateBookingData) {
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        ...data,
        customer_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select(`
        *,
        customer:profiles!customer_id(*),
        provider:profiles!provider_id(*),
        service:services(*)
      `)
      .single();

    if (error) throw error;
    return booking;
  }

  static async getBookings(params: GetBookingsParams = {}) {
    const user = (await supabase.auth.getUser()).data.user;
    
    let query = supabase
      .from('bookings')
      .select(`
        *,
        customer:profiles!customer_id(*),
        provider:profiles!provider_id(*),
        service:services(*)
      `)
      .or(`customer_id.eq.${user?.id},provider_id.eq.${user?.id}`);

    if (params.status) {
      query = query.eq('status', params.status);
    }

    if (params.start_date) {
      query = query.gte('booking_date', params.start_date);
    }

    if (params.end_date) {
      query = query.lte('booking_date', params.end_date);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(
        (params.page || 0) * (params.limit || 10),
        ((params.page || 0) + 1) * (params.limit || 10) - 1
      );

    if (error) throw error;
    return data || [];
  }

  static async updateBookingStatus(id: string, data: UpdateBookingStatusData) {
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({ 
        ...data, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return booking;
  }
}
```

### 3. Error Handling

```typescript
// utils/errors.ts
export class APIError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleSupabaseError = (error: any): never => {
  console.error('Supabase error:', error);
  
  if (error.code === 'PGRST116') {
    throw new APIError('Resource not found', 'NOT_FOUND', 404);
  }
  
  if (error.code === '23505') {
    throw new APIError('Resource already exists', 'DUPLICATE', 409);
  }
  
  if (error.code === '42501') {
    throw new APIError('Insufficient permissions', 'FORBIDDEN', 403);
  }
  
  throw new APIError(
    error.message || 'An unexpected error occurred',
    'INTERNAL_ERROR',
    500
  );
};

// Usage in API calls
try {
  const services = await ServicesAPI.getServices(params);
  return services;
} catch (error) {
  handleSupabaseError(error);
}
```

## 🔒 Security Best Practices

### 1. Environment Variables
```bash
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Server-side only (for Edge Functions)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 2. Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Example policies
CREATE POLICY "Users can view public profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Service providers can update own services" ON services
  FOR UPDATE USING (
    auth.uid() = provider_id AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'provider'
    )
  );
```

### 3. Input Validation
```typescript
// utils/validation.ts
import { z } from 'zod';

export const CreateServiceSchema = z.object({
  category_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(1000),
  price: z.number().positive().max(999999),
  duration: z.number().positive().max(480), // max 8 hours
  image_url: z.string().url().optional()
});

export const CreateBookingSchema = z.object({
  provider_id: z.string().uuid(),
  service_id: z.string().uuid(),
  booking_date: z.string().date(),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  customer_address: z.string().min(10).max(200),
  customer_phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  special_instructions: z.string().max(500).optional()
});

// Usage
export const validateCreateService = (data: any) => {
  return CreateServiceSchema.parse(data);
};
```

### 4. Rate Limiting (Edge Functions)
```typescript
// supabase/functions/rate-limit/index.ts
const rateLimitMap = new Map();

export const rateLimit = (
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
) => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, []);
  }
  
  const requests = rateLimitMap.get(identifier);
  const validRequests = requests.filter((time: number) => time > windowStart);
  
  if (validRequests.length >= maxRequests) {
    throw new Error('Rate limit exceeded');
  }
  
  validRequests.push(now);
  rateLimitMap.set(identifier, validRequests);
};
```

## 🚀 Development Setup

### 1. Supabase Local Development

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize project
supabase init

# Start local development
supabase start

# Reset database
supabase db reset

# Generate TypeScript types
supabase gen types typescript --local > src/types/database.ts
```

### 2. Database Migrations

```sql
-- migrations/001_initial_schema.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('customer', 'provider', 'admin')) DEFAULT 'customer',
  avatar_url TEXT,
  address TEXT,
  pincode TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### 3. Edge Functions Setup

```typescript
// supabase/functions/send-notification/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { bookingId, type } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get booking details
    const { data: booking } = await supabaseClient
      .from('bookings')
      .select(`
        *,
        customer:profiles!customer_id(*),
        provider:profiles!provider_id(*),
        service:services(*)
      `)
      .eq('id', bookingId)
      .single();

    // Send notification logic here
    // Email, SMS, Push notification etc.

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
```

### 4. Testing with Mock Data

```typescript
// scripts/seed-database.ts
import { supabase } from '../src/lib/supabase';

const seedData = async () => {
  // Create service categories
  const { data: categories } = await supabase
    .from('service_categories')
    .insert([
      { name: 'Home Cleaning', slug: 'cleaning', icon: '🏠' },
      { name: 'Repairs & Maintenance', slug: 'repair', icon: '🔧' },
      { name: 'Beauty & Wellness', slug: 'beauty', icon: '💄' },
      { name: 'Plumbing', slug: 'plumbing', icon: '🚰' },
    ])
    .select();

  // Create test users
  const { data: { user } } = await supabase.auth.signUp({
    email: 'provider@test.com',
    password: 'password123'
  });

  if (user) {
    await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      full_name: 'Test Provider',
      role: 'provider',
      phone: '+1234567890'
    });
  }

  console.log('Database seeded successfully');
};

seedData().catch(console.error);
```

### 5. API Testing

```typescript
// tests/api.test.ts
import { describe, it, expect } from 'vitest';
import { ServicesAPI } from '../src/services/api';

describe('Services API', () => {
  it('should fetch services with filters', async () => {
    const result = await ServicesAPI.getServices({
      category_id: 'cleaning-category-id',
      page: 0,
      limit: 10
    });

    expect(result.data).toBeInstanceOf(Array);
    expect(result.page).toBe(0);
    expect(result.limit).toBe(10);
    expect(typeof result.count).toBe('number');
  });

  it('should create a new service', async () => {
    const serviceData = {
      category_id: 'cleaning-category-id',
      name: 'Test Service',
      description: 'Test description',
      price: 100,
      duration: 60
    };

    const service = await ServicesAPI.createService(serviceData);
    
    expect(service.id).toBeDefined();
    expect(service.name).toBe(serviceData.name);
    expect(service.price).toBe(serviceData.price);
  });
});
```

---

## 📝 Summary

This backend guide provides:

1. **Complete database schema** with relationships and constraints
2. **Detailed API data models** with TypeScript interfaces
3. **Authentication patterns** with role-based access control
4. **RESTful API structure** following best practices
5. **Real-time capabilities** using Supabase subscriptions
6. **Security implementation** with RLS and input validation
7. **Development setup** with local Supabase environment

When building new features:

1. **Start with the database schema** - design tables and relationships
2. **Define TypeScript interfaces** - ensure type safety
3. **Implement RLS policies** - secure data access
4. **Create API service methods** - follow established patterns
5. **Add input validation** - prevent invalid data
6. **Test with mock data** - verify functionality
7. **Document the endpoints** - maintain API documentation

Happy backend development! 🚀
