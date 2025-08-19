# CityServe Connect - Frontend Developer Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Design System](#design-system)
5. [UI Components Guide](#ui-components-guide)
6. [Page Structure](#page-structure)
7. [State Management](#state-management)
8. [Routing](#routing)
9. [Component Development Guidelines](#component-development-guidelines)
10. [Getting Started](#getting-started)

## 🏗️ Project Overview

CityServe Connect is a service booking platform that connects customers with local service providers across various categories like home cleaning, repairs, beauty services, plumbing, electrical work, etc.

### Key Features
- **Multi-role system**: Customer, Provider, Admin dashboards
- **Service booking system**: Browse, book, and manage service appointments
- **Provider management**: Profile, services, bookings, reviews
- **Admin panel**: User management, booking oversight, analytics
- **Responsive design**: Mobile-first approach with dark/light mode support

## 🚀 Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: React Router DOM v6
- **State Management**: React Context + Custom Hooks
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Backend**: Supabase (Authentication, Database, Storage)

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components (shadcn/ui)
│   │   ├── button.tsx         # Button component with variants
│   │   ├── card.tsx           # Card layouts
│   │   ├── dialog.tsx         # Modal dialogs
│   │   ├── form.tsx           # Form components
│   │   └── ...
│   ├── common/                # Shared components
│   │   ├── Layout.tsx         # Main app layout
│   │   └── Navbar.tsx         # Navigation component
│   ├── admin/                 # Admin-specific components
│   │   ├── BookingDetailsModal.tsx
│   │   └── CustomerDetailsModal.tsx
│   ├── booking/               # Booking-related components
│   │   └── BookingModal.tsx
│   └── provider/              # Provider-specific components
│       ├── ProviderProfileModal.tsx
│       └── ServiceFormModal.tsx
├── pages/                     # Page components
│   ├── Home.tsx               # Landing page
│   ├── Services.tsx           # Service listing
│   ├── Login.tsx              # Authentication
│   ├── Register.tsx           # User registration
│   ├── admin/                 # Admin pages
│   ├── customer/              # Customer pages
│   └── provider/              # Provider pages
├── contexts/                  # React contexts
│   └── AuthContext.tsx        # Authentication state
├── hooks/                     # Custom React hooks
│   ├── useBookings.ts         # Booking management
│   └── use-toast.ts           # Toast notifications
├── data/                      # Mock data and types
│   └── mockData.ts            # Sample data & TypeScript interfaces
├── lib/                       # Utility functions
│   └── utils.ts               # Common utilities
└── main.tsx                   # App entry point
```

## 🎨 Design System

Our design system is built on semantic tokens defined in `src/index.css` and extended in `tailwind.config.ts`.

### Color Palette

#### Primary Colors
```css
--primary: 25 95% 53%;        /* Vibrant Orange #FF6B35 */
--primary-light: 25 100% 65%; /* Lighter Orange */
--primary-dark: 25 90% 45%;   /* Darker Orange */
```

#### Secondary Colors
```css
--secondary: 213 94% 68%;     /* Trust Blue #4F8BF7 */
--success: 142 76% 36%;       /* Green #22C55E */
--warning: 38 92% 50%;        /* Amber #F59E0B */
--info: 199 89% 48%;          /* Cyan #06B6D4 */
--destructive: 0 84% 60%;     /* Red #EF4444 */
```

### Using Colors in Components

❌ **DON'T** use direct color values:
```tsx
<div className="bg-orange-500 text-white">
```

✅ **DO** use semantic tokens:
```tsx
<div className="bg-primary text-primary-foreground">
```

### Gradients
```css
--gradient-primary: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-light)));
--gradient-hero: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%);
```

Usage:
```tsx
<div className="bg-gradient-hero">
```

### Shadows
```css
--shadow-glow: 0 0 0 1px hsl(var(--primary) / 0.1), 0 0 20px hsl(var(--primary) / 0.1);
```

Usage:
```tsx
<div className="shadow-glow">
```

## 🧩 UI Components Guide

### Button Component

Location: `src/components/ui/button.tsx`

#### Variants
- `default` - Primary orange button
- `secondary` - Secondary blue button  
- `outline` - Bordered button
- `ghost` - Transparent background
- `destructive` - Red for dangerous actions
- `link` - Text link style

#### Sizes
- `default` - Standard size (h-10)
- `sm` - Small (h-9)
- `lg` - Large (h-11)
- `icon` - Square icon button (h-10 w-10)

#### Usage Examples
```tsx
import { Button } from "@/components/ui/button";

// Primary button
<Button>Book Service</Button>

// Secondary outline button
<Button variant="outline" size="lg">
  View Details
</Button>

// Icon button
<Button variant="ghost" size="icon">
  <Heart className="h-4 w-4" />
</Button>

// Destructive action
<Button variant="destructive">
  Delete Account
</Button>
```

### Card Component

Location: `src/components/ui/card.tsx`

#### Structure
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Service Title</CardTitle>
    <CardDescription>Brief description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content here</p>
  </CardContent>
  <CardFooter>
    <Button>Action Button</Button>
  </CardFooter>
</Card>
```

### Dialog/Modal Component

Location: `src/components/ui/dialog.tsx`

#### Usage
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
    </DialogHeader>
    <div>Modal content</div>
  </DialogContent>
</Dialog>
```

### Form Components

Location: `src/components/ui/form.tsx`

#### With React Hook Form
```tsx
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const form = useForm();

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="serviceName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Service Name</FormLabel>
          <FormControl>
            <Input placeholder="Enter service name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

### Badge Component

Location: `src/components/ui/badge.tsx`

#### Variants
```tsx
import { Badge } from "@/components/ui/badge";

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Available/Completed</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="info">In Progress</Badge>
<Badge variant="destructive">Cancelled</Badge>
<Badge variant="outline">Outline</Badge>
```

#### Status Color System
The badge component supports semantic color variants for booking statuses:
- `success` - For completed and confirmed bookings (green)
- `warning` - For pending bookings (amber/yellow)
- `info` - For in-progress bookings (cyan/blue)
- `destructive` - For cancelled bookings (red)
- `secondary` - For general/default states (muted)

## 📄 Page Structure

### Main Layout
All pages use the common layout structure defined in `src/components/common/Layout.tsx`:

```tsx
import { Layout } from "@/components/common/Layout";

export default function YourPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Page content */}
      </div>
    </Layout>
  );
}
```

### Page Examples

#### Services Page (`src/pages/Services.tsx`)
- Service category grid
- Provider listings with filters
- Service booking modal
- Provider profile modal with navigation to full profile

#### Dashboard Pages
- **Customer Dashboard** (`src/pages/customer/CustomerDashboard.tsx`): Booking history, service browsing
- **Provider Dashboard** (`src/pages/provider/ProviderDashboard.tsx`): Service management, booking overview with pagination
- **Admin Dashboard** (`src/pages/admin/AdminDashboard.tsx`): User management, booking oversight, analytics

#### Profile Pages
- **Customer Profile** (`src/pages/customer/CustomerProfile.tsx`): Personal info, booking history, reviews
- **Provider Profile** (`src/pages/provider/ProviderProfile.tsx`): Business info, services, reviews, availability

### New Features Added
- **Pagination**: BookingsWithPagination component for provider dashboard (5 items per page)
- **Profile Navigation**: Admin can click customer/provider names to view their profiles
- **Mobile Responsive Design**: All modals and components optimized for mobile
- **Enhanced Button Alignment**: Fixed mobile view issues with proper flex wrapping
- **Responsive Booking Details Modal**: Service and Customer Information sections hidden on mobile (sm and below)
- **Status Color System**: Improved status color mapping with distinct colors for different booking states
- **Customer Dashboard Booking Management**: Cancel functionality for pending bookings, removed reschedule option

## 🎯 State Management

### Authentication Context
Location: `src/contexts/AuthContext.tsx`

```tsx
import { useAuth } from "@/contexts/AuthContext";

function Component() {
  const { user, login, logout, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  return user ? <Dashboard /> : <LoginForm />;
}
```

### Custom Hooks
- `useBookings()` - Booking management
- `useToast()` - Toast notifications
- `useMobile()` - Mobile detection

### State Pattern
```tsx
// Local state for component-specific data
const [isModalOpen, setIsModalOpen] = useState(false);

// Context for app-wide state
const { user } = useAuth();

// Custom hooks for complex logic
const { bookings, createBooking } = useBookings();
```

## 🛣️ Routing

Using React Router v6 with nested routes:

```tsx
// src/App.tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/services" element={<Services />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/customer/*" element={<CustomerDashboard />} />
  <Route path="/provider/*" element={<ProviderDashboard />} />
  <Route path="/admin/*" element={<AdminDashboard />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Navigation
```tsx
import { useNavigate, Link } from "react-router-dom";

// Programmatic navigation
const navigate = useNavigate();
navigate("/services");

// Declarative navigation
<Link to="/services" className="text-primary hover:underline">
  Browse Services
</Link>
```

## 🛠️ Component Development Guidelines

### 1. Component Structure
```tsx
import React from "react";
import { cn } from "@/lib/utils";

interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  // Other props...
}

export const Component: React.FC<ComponentProps> = ({ 
  className, 
  children, 
  ...props 
}) => {
  return (
    <div className={cn("base-styles", className)} {...props}>
      {children}
    </div>
  );
};
```

### 2. TypeScript Best Practices
```tsx
// Define clear interfaces
interface Service {
  id: string;
  name: string;
  price: number;
  // ... other properties
}

// Use proper typing for props
interface ServiceCardProps {
  service: Service;
  onBook: (serviceId: string) => void;
  className?: string;
}

// Export interfaces for reuse
export type { Service, ServiceCardProps };
```

### 3. Responsive Design
```tsx
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Grid items */}
</div>

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
  {/* Content */}
</div>
```

### 4. Accessibility
```tsx
// Proper ARIA labels
<button 
  aria-label="Book this service"
  className="..."
>
  <BookIcon />
</button>

// Semantic HTML
<main>
  <h1>Page Title</h1>
  <section aria-labelledby="services-heading">
    <h2 id="services-heading">Available Services</h2>
    {/* Services list */}
  </section>
</main>
```

### 5. Performance Optimization
```tsx
// Lazy loading for large components
import { lazy, Suspense } from "react";

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

// Use in component
<Suspense fallback={<div>Loading...</div>}>
  <AdminDashboard />
</Suspense>

// Memoization for expensive operations
const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/bun

### Setup Steps

1. **Clone the repository**
```bash
git clone [repository-url]
cd cityserve-connect
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
bun install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. **Build for production**
```bash
npm run build
# or
yarn build
# or
bun run build
```

### Development Workflow

1. **Create feature branch**
```bash
git checkout -b feature/new-service-component
```

2. **Develop component**
- Create component in appropriate directory
- Add TypeScript interfaces
- Implement responsive design
- Add proper accessibility

3. **Test component**
- Test in different screen sizes
- Test with keyboard navigation
- Test in dark/light modes

4. **Create pull request**
- Follow commit message conventions
- Include component documentation
- Add screenshots if UI changes

### File Naming Conventions

- **Components**: PascalCase (`ServiceCard.tsx`)
- **Pages**: PascalCase (`CustomerDashboard.tsx`)
- **Hooks**: camelCase starting with 'use' (`useBookings.ts`)
- **Utils**: camelCase (`formatPrice.ts`)
- **Types**: PascalCase with descriptive names (`ServiceProvider.ts`)

### Code Style Guidelines

- Use TypeScript for all new components
- Follow ESLint rules (configured in project)
- Use Prettier for code formatting
- Prefer functional components with hooks
- Use semantic HTML elements
- Follow BEM-like class naming for custom styles

### Common Patterns

#### Loading States
```tsx
if (isLoading) {
  return <div className="animate-pulse">Loading...</div>;
}
```

#### Error Handling
```tsx
if (error) {
  return (
    <div className="text-destructive">
      Error: {error.message}
    </div>
  );
}
```

#### Conditional Rendering
```tsx
{user?.role === 'admin' && (
  <AdminPanel />
)}
```

#### Event Handlers
```tsx
const handleSubmit = useCallback((data: FormData) => {
  // Handle form submission
}, []);
```

### Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [React Hook Form](https://react-hook-form.com/)
- [Lucide Icons](https://lucide.dev/icons/)
- [React Router](https://reactrouter.com/)

---

## 🤝 Contributing

When contributing to the frontend:

1. Follow the component structure guidelines
2. Use the design system tokens
3. Ensure responsive design
4. Add proper TypeScript types
5. Test across different devices
6. Document complex components
7. Follow accessibility guidelines

Happy coding! 🚀
