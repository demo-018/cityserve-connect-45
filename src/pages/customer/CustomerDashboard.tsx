import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Star, Plus, CreditCard, Eye, User } from 'lucide-react';
import { mockBookings, mockServices, mockProviders } from '@/data/mockData';
import Layout from '@/components/common/Layout';
import { useBookings } from '@/hooks/useBookings';
import BookingDetailsModal from '@/components/admin/BookingDetailsModal';
import ProviderProfileModal from '@/components/provider/ProviderProfileModal';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { bookings, cancelBooking } = useBookings();
  
  // Modal states
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  
  // Get user's bookings
  const userBookings = mockBookings.filter(booking => booking.customerId === user?.id);
  const upcomingBookings = userBookings.filter(booking => 
    ['pending', 'confirmed'].includes(booking.status)
  );
  const completedBookings = userBookings.filter(booking => 
    booking.status === 'completed'
  );
  
  // Recent activity shows in-progress, completed, and cancelled bookings
  const recentActivityBookings = userBookings.filter(booking => 
    ['in-progress', 'completed', 'cancelled'].includes(booking.status)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'in-progress':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getServiceDetails = (serviceId: string) => {
    return mockServices.find(service => service.id === serviceId);
  };

  const getProviderDetails = (providerId: string) => {
    return mockProviders.find(provider => provider.id === providerId);
  };

  // Handler functions for modals
  const handleViewBookingDetails = (booking: any) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  const handleViewProviderProfile = (booking: any) => {
    const provider = getProviderDetails(booking.providerId);
    setSelectedProvider(provider);
    setShowProviderModal(true);
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    setSelectedBooking(null);
  };

  const handleCloseProviderModal = () => {
    setShowProviderModal(false);
    setSelectedProvider(null);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground">
              Manage your bookings and discover new services
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{upcomingBookings.length}</p>
                    <p className="text-sm text-muted-foreground">Upcoming</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-8 h-8 text-success" />
                  <div>
                    <p className="text-2xl font-bold">{completedBookings.length}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-8 h-8 text-info" />
                  <div>
                    <p className="text-2xl font-bold">₹{userBookings.reduce((sum, booking) => sum + booking.totalAmount, 0)}</p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-8 h-8 text-warning" />
                  <div>
                    <p className="text-2xl font-bold">4.8</p>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Bookings */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Upcoming Bookings</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/customer/bookings">View All</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => {
                        const service = getServiceDetails(booking.serviceId);
                        const provider = getProviderDetails(booking.providerId);
                        
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
                                <MapPin className="w-4 h-4" />
                                <span>Provider: {provider?.name}</span>
                              </div>
                              <div className="flex items-center justify-between mt-3">
                                <span className="font-semibold text-foreground">₹{booking.totalAmount}</span>
                                <div className="space-x-2">
                                  <Button variant="outline" size="sm">Contact</Button>
                                  {booking.status === 'pending' && (
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      onClick={() => cancelBooking(booking.id)}
                                    >
                                      Cancel
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No upcoming bookings</p>
                      <Button variant="hero" asChild>
                        <Link to="/services">Book a Service</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentActivityBookings.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivityBookings.map((booking) => {
                        const service = getServiceDetails(booking.serviceId);
                        const provider = getProviderDetails(booking.providerId);
                        
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
                                <MapPin className="w-4 h-4" />
                                <span>Provider: {provider?.name}</span>
                              </div>
                              <div className="flex items-center justify-between mt-3">
                                <span className="font-semibold text-foreground">₹{booking.totalAmount}</span>
                                <div className="space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleViewBookingDetails(booking)}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View Details
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleViewProviderProfile(booking)}
                                  >
                                    <User className="w-4 h-4 mr-1" />
                                    Provider
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No recent activity</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="hero" asChild>
                    <Link to="/services">
                      <Plus className="w-4 h-4 mr-2" />
                      Book New Service
                    </Link>
                  </Button>
                  <Button className="w-full" variant="outline" asChild>
                    <Link to="/customer/bookings">View All Bookings</Link>
                  </Button>
                  <Button className="w-full" variant="outline" asChild>
                    <Link to="/customer/favorites">My Favorites</Link>
                  </Button>
                  <Button className="w-full" variant="outline" asChild>
                    <Link to="/support">Get Support</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{user?.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Area</p>
                    <p className="font-medium">{user?.address}</p>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/profile">Edit Profile</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showBookingModal && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          isOpen={showBookingModal}
          onClose={handleCloseBookingModal}
        />
      )}

      {showProviderModal && selectedProvider && (
        <ProviderProfileModal
          provider={selectedProvider}
          isOpen={showProviderModal}
          onClose={handleCloseProviderModal}
        />
      )}
    </Layout>
  );
};

export default CustomerDashboard;