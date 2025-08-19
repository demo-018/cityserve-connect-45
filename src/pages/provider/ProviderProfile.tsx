import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/enhanced-button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Clock,
  DollarSign,
  Award,
  Shield
} from 'lucide-react';
import { mockProviders, mockServices, mockBookings, mockReviews } from '@/data/mockData';
import Layout from '@/components/common/Layout';

const ProviderProfile = () => {
  const { providerId } = useParams();
  
  const provider = mockProviders.find(p => p.id === providerId);
  const providerServices = mockServices.filter(s => s.providerId === providerId);
  const providerBookings = mockBookings.filter(b => b.providerId === providerId);
  const providerReviews = mockReviews.filter(r => r.providerId === providerId);

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

  if (!provider) {
    return (
      <Layout>
        <div className="min-h-screen bg-muted/30 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Provider Not Found</h2>
              <p className="text-muted-foreground">No provider found with ID: {providerId}</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const totalEarnings = providerBookings
    .filter(booking => booking.status === 'completed')
    .reduce((sum, booking) => sum + booking.totalAmount * 0.9, 0); // 90% after platform fee

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="mb-4"
            >
              ← Back
            </Button>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl">
                  {provider.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">{provider.name}</h1>
                  {provider.verified && (
                    <Badge variant="success" className="w-fit">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-2">Service Provider</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                    <span className="font-medium">{provider.rating}</span>
                    <span className="text-sm text-muted-foreground ml-1">
                      ({provider.reviews} reviews)
                    </span>
                  </div>
                  <Badge variant="outline">
                    {provider.experience} years experience
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{providerBookings.length}</p>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-8 h-8 text-success" />
                  <div>
                    <p className="text-2xl font-bold">₹{totalEarnings.toFixed(0)}</p>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Award className="w-8 h-8 text-warning" />
                  <div>
                    <p className="text-2xl font-bold">{providerServices.length}</p>
                    <p className="text-sm text-muted-foreground">Services Offered</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-8 h-8 text-info" />
                  <div>
                    <p className="text-2xl font-bold">
                      {providerBookings.filter(b => b.status === 'completed').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-lg">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Provider Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{provider.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{provider.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{provider.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Service Area</p>
                        <p className="font-medium">{provider.address || 'Mumbai, India'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Experience</p>
                        <p className="font-medium">{provider.experience} years</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Verification Status</p>
                        <Badge variant={provider.verified ? 'success' : 'warning'}>
                          {provider.verified ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Services Offered</CardTitle>
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
                            <span className="text-sm text-muted-foreground">{service.duration}min</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {providerBookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">Booking #{booking.id}</h3>
                          <Badge variant={getStatusColor(booking.status) as any}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Customer</p>
                            <p className="font-medium">{booking.customerName}</p>
                          </div>
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
                        </div>
                      </div>
                    ))}
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
                    {providerReviews.length > 0 ? (
                      providerReviews.map((review) => (
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
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">No reviews received yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ProviderProfile;