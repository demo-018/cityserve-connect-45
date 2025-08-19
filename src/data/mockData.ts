export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number; // in minutes
  image: string;
  rating: number;
  reviews: number;
  providerId: string;
  available: boolean;
}

export interface ServiceProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  services: string[];
  rating: number;
  reviews: number;
  experience: number;
  verified: boolean;
  avatar: string;
  description: string;
  address: string;
  pincode: string;
  availability: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  providerId: string;
}

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  rating: number;
  comment: string;
  createdAt: string;
  customerName: string;
}

export const serviceCategories = [
  { id: 'cleaning', name: 'Home Cleaning', icon: '🏠', providers: 45 },
  { id: 'repair', name: 'Repairs & Maintenance', icon: '🔧', providers: 32 },
  { id: 'beauty', name: 'Beauty & Wellness', icon: '💄', providers: 28 },
  { id: 'plumbing', name: 'Plumbing', icon: '🚰', providers: 25 },
  { id: 'electrical', name: 'Electrical', icon: '⚡', providers: 18 },
  { id: 'appliance', name: 'Appliance Repair', icon: '📱', providers: 22 },
  { id: 'painting', name: 'Painting', icon: '🎨', providers: 15 },
  { id: 'gardening', name: 'Gardening', icon: '🌱', providers: 12 }
];

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Deep House Cleaning',
    category: 'cleaning',
    description: 'Complete deep cleaning of your home including all rooms, kitchen, and bathrooms',
    price: 2499,
    duration: 240,
    image: '/api/placeholder/300/200',
    rating: 4.8,
    reviews: 156,
    providerId: '2',
    available: true
  },
  {
    id: '2',
    name: 'AC Service & Repair',
    category: 'repair',
    description: 'Professional AC cleaning, gas refilling, and repair services',
    price: 899,
    duration: 120,
    image: '/api/placeholder/300/200',
    rating: 4.6,
    reviews: 89,
    providerId: '2',
    available: true
  },
  {
    id: '3',
    name: 'Facial & Cleanup',
    category: 'beauty',
    description: 'Relaxing facial with deep cleansing and moisturizing treatment',
    price: 1299,
    duration: 90,
    image: '/api/placeholder/300/200',
    rating: 4.9,
    reviews: 234,
    providerId: '4',
    available: true
  },
  {
    id: '4',
    name: 'Bathroom Plumbing Fix',
    category: 'plumbing',
    description: 'Fix leaky taps, clogged drains, and other bathroom plumbing issues',
    price: 599,
    duration: 60,
    image: '/api/placeholder/300/200',
    rating: 4.7,
    reviews: 67,
    providerId: '5',
    available: true
  }
];

export const mockProviders: ServiceProvider[] = [
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'provider@demo.com',
    phone: '+91 87654 32109',
    services: ['1', '2'],
    rating: 4.7,
    reviews: 89,
    experience: 3,
    verified: true,
    avatar: '/api/placeholder/100/100',
    description: 'Professional home service provider with 3+ years of experience',
    address: 'B-456, Lajpat Nagar',
    pincode: '110024',
    availability: [
      {
        id: 'slot1',
        date: '2024-01-20',
        startTime: '09:00',
        endTime: '17:00',
        available: true,
        providerId: '2'
      }
    ]
  },
  {
    id: '4',
    name: 'Meera Beauty',
    email: 'meera@beauty.com',
    phone: '+91 98765 43210',
    services: ['3'],
    rating: 4.9,
    reviews: 234,
    experience: 5,
    verified: true,
    avatar: '/api/placeholder/100/100',
    description: 'Certified beauty professional specializing in skincare treatments',
    address: 'C-789, Khan Market',
    pincode: '110003',
    availability: []
  },
  {
    id: '5',
    name: 'Ramesh Plumber',
    email: 'ramesh@plumbing.com',
    phone: '+91 76543 21098',
    services: ['4'],
    rating: 4.6,
    reviews: 67,
    experience: 7,
    verified: true,
    avatar: '/api/placeholder/100/100',
    description: 'Expert plumber with 7+ years of experience in residential repairs',
    address: 'D-321, Karol Bagh',
    pincode: '110005',
    availability: []
  }
];

export const mockBookings: Booking[] = [
  {
    id: 'booking1',
    customerId: '1',
    providerId: '2',
    serviceId: '1',
    date: '2024-01-22',
    timeSlot: '10:00-14:00',
    status: 'confirmed',
    totalAmount: 2499,
    customerName: 'Rajesh Kumar',
    customerPhone: '+91 98765 43210',
    customerAddress: 'A-123, Green Park Extension, New Delhi',
    paymentStatus: 'paid',
    createdAt: '2024-01-20T10:30:00Z'
  },
  {
    id: 'booking2',
    customerId: '1',
    providerId: '4',
    serviceId: '3',
    date: '2024-01-25',
    timeSlot: '15:00-16:30',
    status: 'pending',
    totalAmount: 1299,
    customerName: 'Rajesh Kumar',
    customerPhone: '+91 98765 43210',
    customerAddress: 'A-123, Green Park Extension, New Delhi',
    paymentStatus: 'pending',
    createdAt: '2024-01-21T14:15:00Z'
  },
  {
    id: 'booking3',
    customerId: '1',
    providerId: '3',
    serviceId: '2',
    date: '2024-01-18',
    timeSlot: '14:00-15:00',
    status: 'completed',
    totalAmount: 1999,
    customerName: 'Rajesh Kumar',
    customerPhone: '+91 98765 43210',
    customerAddress: 'A-123, Green Park Extension, New Delhi',
    paymentStatus: 'paid',
    createdAt: '2024-01-16T09:15:00Z'
  },
  {
    id: 'booking4',
    customerId: '1',
    providerId: '5',
    serviceId: '5',
    date: '2024-01-20',
    timeSlot: '11:00-13:00',
    status: 'in-progress',
    totalAmount: 3499,
    customerName: 'Rajesh Kumar',
    customerPhone: '+91 98765 43210',
    customerAddress: 'A-123, Green Park Extension, New Delhi',
    paymentStatus: 'paid',
    createdAt: '2024-01-18T16:20:00Z'
  },
  {
    id: 'booking5',
    customerId: '1',
    providerId: '6',
    serviceId: '7',
    date: '2024-01-15',
    timeSlot: '09:00-17:00',
    status: 'completed',
    totalAmount: 8999,
    customerName: 'Rajesh Kumar',
    customerPhone: '+91 98765 43210',
    customerAddress: 'A-123, Green Park Extension, New Delhi',
    paymentStatus: 'paid',
    createdAt: '2024-01-13T11:45:00Z'
  },
  {
    id: 'booking6',
    customerId: '1',
    providerId: '1',
    serviceId: '1',
    date: '2024-01-12',
    timeSlot: '16:00-18:00',
    status: 'cancelled',
    totalAmount: 1799,
    customerName: 'Rajesh Kumar',
    customerPhone: '+91 98765 43210',
    customerAddress: 'A-123, Green Park Extension, New Delhi',
    paymentStatus: 'refunded',
    createdAt: '2024-01-10T14:30:00Z'
  },
  {
    id: 'booking7',
    customerId: '1',
    providerId: '7',
    serviceId: '9',
    date: '2024-01-14',
    timeSlot: '10:00-12:00',
    status: 'completed',
    totalAmount: 2299,
    customerName: 'Rajesh Kumar',
    customerPhone: '+91 98765 43210',
    customerAddress: 'A-123, Green Park Extension, New Delhi',
    paymentStatus: 'paid',
    createdAt: '2024-01-12T08:15:00Z'
  },
  {
    id: 'booking8',
    customerId: '1',
    providerId: '8',
    serviceId: '11',
    date: '2024-01-16',
    timeSlot: '13:00-14:30',
    status: 'cancelled',
    totalAmount: 1499,
    customerName: 'Rajesh Kumar',
    customerPhone: '+91 98765 43210',
    customerAddress: 'A-123, Green Park Extension, New Delhi',
    paymentStatus: 'refunded',
    createdAt: '2024-01-14T10:20:00Z'
  }
];

export const providers = [
  {
    id: '1',
    name: 'CleanHome Services',
    location: 'South Delhi',
    services: ['Home Cleaning', 'Deep Cleaning', 'Kitchen Cleaning'],
    rating: 4.8,
    totalReviews: 156,
    hourlyRate: 150,
    responseTime: '< 2 hrs',
    isAvailable: true
  },
  {
    id: '2', 
    name: 'Priya Sharma',
    location: 'Lajpat Nagar, Delhi',
    services: ['AC Repair', 'Appliance Service', 'Home Cleaning'],
    rating: 4.7,
    totalReviews: 89,
    hourlyRate: 200,
    responseTime: '< 1 hr',
    isAvailable: true
  },
  {
    id: '3',
    name: 'BeautyPro Delhi',
    location: 'Khan Market, Delhi',
    services: ['Beauty & Wellness', 'Facial', 'Massage'],
    rating: 4.9,
    totalReviews: 234,
    hourlyRate: 300,
    responseTime: '< 3 hrs',
    isAvailable: true
  },
  {
    id: '4',
    name: 'Ramesh Plumbing',
    location: 'Karol Bagh, Delhi',
    services: ['Plumbing', 'Pipe Repair', 'Bathroom Fixing'],
    rating: 4.6,
    totalReviews: 67,
    hourlyRate: 180,
    responseTime: '< 30 min',
    isAvailable: false
  },
  {
    id: '5',
    name: 'ElectricFix Pro',
    location: 'Gurgaon',
    services: ['Electrical', 'Wiring', 'Switch Repair'],
    rating: 4.5,
    totalReviews: 45,
    hourlyRate: 220,
    responseTime: '< 1 hr',
    isAvailable: true
  },
  {
    id: '6',
    name: 'PaintMaster',
    location: 'Noida',
    services: ['Painting', 'Wall Painting', 'Interior Design'],
    rating: 4.7,
    totalReviews: 78,
    hourlyRate: 160,
    responseTime: '< 2 hrs',
    isAvailable: true
  },
  {
    id: '7',
    name: 'GreenThumb Gardens',
    location: 'Bangalore',
    services: ['Gardening', 'Plant Care', 'Lawn Maintenance'],
    rating: 4.4,
    totalReviews: 32,
    hourlyRate: 140,
    responseTime: '< 4 hrs',
    isAvailable: true
  },
  {
    id: '8',
    name: 'TechRepair Hub',
    location: 'Mumbai',
    services: ['Appliance Repair', 'Phone Repair', 'TV Repair'],
    rating: 4.6,
    totalReviews: 94,
    hourlyRate: 250,
    responseTime: '< 1 hr',
    isAvailable: true
  }
];

export const mockReviews: Review[] = [
  {
    id: 'review1',
    bookingId: 'booking1',
    customerId: '1',
    providerId: '2',
    serviceId: '1',
    rating: 5,
    comment: 'Excellent service! Very thorough cleaning and professional behavior.',
    createdAt: '2024-01-20T18:30:00Z',
    customerName: 'Rajesh Kumar'
  },
  {
    id: 'review2',
    bookingId: 'booking2',
    customerId: '1',
    providerId: '4',
    serviceId: '3',
    rating: 5,
    comment: 'Amazing facial treatment. Skin feels so fresh and clean!',
    createdAt: '2024-01-19T16:45:00Z',
    customerName: 'Rajesh Kumar'
  }
];