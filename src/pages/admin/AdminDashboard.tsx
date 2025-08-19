import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  UserCheck,
  Settings
} from 'lucide-react';
import { mockBookings, mockServices, mockProviders, mockReviews } from '@/data/mockData';
import Layout from '@/components/common/Layout';
import BookingDetailsModal from '@/components/admin/BookingDetailsModal';
import CustomerDetailsModal from '@/components/admin/CustomerDetailsModal';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  // Analytics data
  const totalBookings = mockBookings.length;
  const totalProviders = mockProviders.length;
  const totalRevenue = mockBookings
    .filter(booking => booking.status === 'completed')
    .reduce((sum, booking) => sum + booking.totalAmount * 0.1, 0); // 10% commission
  
  const pendingBookings = mockBookings.filter(booking => booking.status === 'pending');
  const activeServices = mockServices.filter(service => service.available);
  const verifiedProviders = mockProviders.filter(provider => provider.verified);
  
  // Recent activities
  const recentBookings = mockBookings.slice(0, 5);
  const recentReviews = mockReviews.slice(0, 3);

  // Modal states
  const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isCustomerDetailsOpen, setIsCustomerDetailsOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedCustomerName, setSelectedCustomerName] = useState('');

  const handleViewBookingDetails = (booking: any) => {
    setSelectedBooking(booking);
    setIsBookingDetailsOpen(true);
  };

  const handleCustomerClick = (customerId: string, customerName: string) => {
    setSelectedCustomerId(customerId);
    setSelectedCustomerName(customerName);
    setIsCustomerDetailsOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'in-progress':
        return 'info';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Platform overview and management
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{totalBookings}</p>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-8 h-8 text-success" />
                  <div>
                    <p className="text-2xl font-bold">{totalProviders}</p>
                    <p className="text-sm text-muted-foreground">Service Providers</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-8 h-8 text-warning" />
                  <div>
                    <p className="text-2xl font-bold">₹{totalRevenue.toFixed(0)}</p>
                    <p className="text-sm text-muted-foreground">Platform Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-8 h-8 text-info" />
                  <div>
                    <p className="text-2xl font-bold">{activeServices.length}</p>
                    <p className="text-sm text-muted-foreground">Active Services</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid grid-cols-5 w-full max-w-2xl">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="providers">Providers</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Pending Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                      <span>Pending Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Provider Verifications</span>
                      <Badge variant="warning">{mockProviders.filter(p => !p.verified).length} Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Service Approvals</span>
                      <Badge variant="warning">1 Pending</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-sm text-muted-foreground">
                            Booked service for {new Date(booking.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={getStatusColor(booking.status) as any}>
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentReviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{review.customerName}</span>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-4 h-4 rounded-full ${
                                  i < review.rating ? 'bg-warning' : 'bg-muted'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>All Bookings</CardTitle>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">Export</Button>
                    <Button variant="outline" size="sm">Filter</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockBookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">Booking #{booking.id}</h3>
                             <Button 
                               variant="link" 
                               className="p-0 h-auto text-sm text-primary hover:underline"
                               onClick={() => window.open(`/customer/profile/${booking.customerId}`, '_blank')}
                             >
                               {booking.customerName}
                             </Button>
                          </div>
                          <Badge variant={getStatusColor(booking.status) as any}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Date</p>
                            <p className="font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Time</p>
                            <p className="font-medium">{booking.timeSlot}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Amount</p>
                            <p className="font-medium">₹{booking.totalAmount}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewBookingDetails(booking)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="providers" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Service Providers</CardTitle>
                  <Button variant="hero" size="sm">
                    Add Provider
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockProviders.map((provider) => (
                      <div key={provider.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="font-medium text-primary">
                                {provider.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold">{provider.name}</h3>
                              <p className="text-sm text-muted-foreground">{provider.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={provider.verified ? 'success' : 'warning'}>
                              {provider.verified ? 'Verified' : 'Pending'}
                            </Badge>
                            <Badge variant="outline">
                              {provider.services.length} services
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Rating</p>
                            <p className="font-medium">{provider.rating} ⭐</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Reviews</p>
                            <p className="font-medium">{provider.reviews}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Experience</p>
                            <p className="font-medium">{provider.experience} years</p>
                          </div>
                           <div className="flex space-x-2">
                             <Button 
                               variant="outline" 
                               size="sm"
                               onClick={() => window.open(`/provider/profile/${provider.id}`, '_blank')}
                             >
                               <Eye className="w-4 h-4" />
                             </Button>
                             <Button variant={provider.verified ? 'outline' : 'success'} size="sm">
                               <UserCheck className="w-4 h-4" />
                             </Button>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>All Services</CardTitle>
                  <Button variant="hero" size="sm">
                    Add Service
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {mockServices.map((service) => (
                      <Card key={service.id} className="border border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{service.name}</h3>
                            <Badge variant={service.available ? 'success' : 'secondary'}>
                              {service.available ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {service.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className="font-bold text-primary">₹{service.price}</span>
                              <span className="text-sm text-muted-foreground">{service.duration}min</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Settings className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary mb-2">
                      ₹{totalRevenue.toFixed(0)}
                    </div>
                    <p className="text-muted-foreground text-sm">This month's commission</p>
                    <Button variant="outline" className="w-full mt-4">
                      View Details
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-success mb-2">
                      {totalBookings}
                    </div>
                    <p className="text-muted-foreground text-sm">Total bookings this month</p>
                    <Button variant="outline" className="w-full mt-4">
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Service Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-info mb-2">
                      4.8
                    </div>
                    <p className="text-muted-foreground text-sm">Average service rating</p>
                    <Button variant="outline" className="w-full mt-4">
                      View Reports
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Modals */}
        <BookingDetailsModal
          booking={selectedBooking}
          isOpen={isBookingDetailsOpen}
          onClose={() => setIsBookingDetailsOpen(false)}
          onCustomerClick={handleCustomerClick}
        />

        <CustomerDetailsModal
          customerId={selectedCustomerId}
          customerName={selectedCustomerName}
          isOpen={isCustomerDetailsOpen}
          onClose={() => setIsCustomerDetailsOpen(false)}
        />
      </div>
    </Layout>
  );
};

export default AdminDashboard;