import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, DollarSign, Star, Users, TrendingUp, Phone, MapPin } from 'lucide-react';
import { mockBookings, mockServices, mockReviews } from '@/data/mockData';
import Layout from '@/components/common/Layout';
import ServiceFormModal from '@/components/provider/ServiceFormModal';
import BookingDetailsModal from '@/components/admin/BookingDetailsModal';
import CustomerDetailsModal from '@/components/admin/CustomerDetailsModal';

const ProviderDashboard = () => {
  const { user } = useAuth();
  
  // Get provider's bookings and services
  const providerBookings = mockBookings.filter(booking => booking.providerId === user?.id);
  const providerServices = mockServices.filter(service => service.providerId === user?.id);
  const providerReviews = mockReviews.filter(review => review.providerId === user?.id);
  
  const todayBookings = providerBookings.filter(booking => 
    new Date(booking.date).toDateString() === new Date().toDateString()
  );
  
  const monthlyEarnings = providerBookings
    .filter(booking => booking.status === 'completed')
    .reduce((sum, booking) => sum + booking.totalAmount, 0);

  const averageRating = providerReviews.length > 0 
    ? (providerReviews.reduce((sum, review) => sum + review.rating, 0) / providerReviews.length).toFixed(1)
    : '0';

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

  // Time slots management
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const timeSlots = [
    '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
    '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'
  ];

  // Modal states
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [serviceModalMode, setServiceModalMode] = useState<'add' | 'edit'>('add');
  const [isBookingDetailsOpen, setIsBookingDetailsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isCustomerDetailsOpen, setIsCustomerDetailsOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedCustomerName, setSelectedCustomerName] = useState('');

  const handleAddService = () => {
    setSelectedService(null);
    setServiceModalMode('add');
    setIsServiceModalOpen(true);
  };

  const handleEditService = (service: any) => {
    setSelectedService(service);
    setServiceModalMode('edit');
    setIsServiceModalOpen(true);
  };

  const handleViewBookingDetails = (booking: any) => {
    setSelectedBooking(booking);
    setIsBookingDetailsOpen(true);
  };

  const handleCustomerClick = (customerId: string, customerName: string) => {
    setSelectedCustomerId(customerId);
    setSelectedCustomerName(customerName);
    setIsCustomerDetailsOpen(true);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Provider Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your services, bookings, and availability
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{todayBookings.length}</p>
                    <p className="text-sm text-muted-foreground">Today's Bookings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-8 h-8 text-success" />
                  <div>
                    <p className="text-2xl font-bold">₹{monthlyEarnings}</p>
                    <p className="text-sm text-muted-foreground">Monthly Earnings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-8 h-8 text-warning" />
                  <div>
                    <p className="text-2xl font-bold">{averageRating}</p>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-8 h-8 text-info" />
                  <div>
                    <p className="text-2xl font-bold">{providerBookings.length}</p>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Bookings</CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {providerBookings.slice(0, 5).map((booking) => {
                      const service = providerServices.find(s => s.id === booking.serviceId);
                      
                      return (
                        <div key={booking.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold">{service?.name}</h3>
                            <Badge variant={getStatusColor(booking.status) as any}>
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(booking.date).toLocaleDateString()}</span>
                              <Clock className="w-4 h-4 ml-4" />
                              <span>{booking.timeSlot}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4" />
                              <Button 
                                variant="link" 
                                className="p-0 h-auto font-medium text-primary hover:underline"
                                onClick={() => handleCustomerClick(booking.customerId, booking.customerName)}
                              >
                                {booking.customerName}
                              </Button>
                              <Phone className="w-4 h-4 ml-4" />
                              <span>{booking.customerPhone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate">{booking.customerAddress}</span>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <span className="font-semibold text-foreground">₹{booking.totalAmount}</span>
                              <div className="space-x-2">
                                {booking.status === 'confirmed' && (
                                  <Button variant="hero" size="sm">Start Service</Button>
                                )}
                                {booking.status === 'pending' && (
                                  <>
                                    <Button variant="outline" size="sm">Decline</Button>
                                    <Button variant="success" size="sm">Accept</Button>
                                  </>
                                )}
                                <Button variant="outline" size="sm">Contact</Button>
                                <Button variant="outline" size="sm" onClick={() => handleViewBookingDetails(booking)}>
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>My Services</CardTitle>
                  <Button variant="hero" size="sm" onClick={handleAddService}>
                    Add New Service
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {providerServices.map((service) => (
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
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 fill-warning text-warning" />
                                <span className="text-sm">{service.rating}</span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => handleEditService(service)}>
                              Edit
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="availability" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium">Select Date</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="mt-1 block w-full max-w-xs px-3 py-2 border border-input rounded-md"
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Time Slots for {selectedDate}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot}
                            variant="outline"
                            className="h-12"
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-4">
                      <Button variant="success">Save Changes</Button>
                      <Button variant="outline">Reset</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {providerReviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{review.customerName}</span>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'fill-warning text-warning' : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Modals */}
        <ServiceFormModal
          isOpen={isServiceModalOpen}
          onClose={() => setIsServiceModalOpen(false)}
          service={selectedService}
          mode={serviceModalMode}
        />

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

export default ProviderDashboard;