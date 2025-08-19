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
  DollarSign
} from 'lucide-react';
import { mockBookings, mockReviews } from '@/data/mockData';
import Layout from '@/components/common/Layout';

const CustomerProfile = () => {
  const { customerId } = useParams();
  
  // Find customer data from bookings
  const customerBookings = mockBookings.filter(booking => booking.customerId === customerId);
  const customer = customerBookings.length > 0 ? {
    id: customerId,
    name: customerBookings[0].customerName,
    phone: customerBookings[0].customerPhone,
    address: customerBookings[0].customerAddress,
    email: `${customerBookings[0].customerName.toLowerCase().replace(' ', '.')}@example.com`,
    joinedDate: '2024-01-15',
    totalBookings: customerBookings.length,
    totalSpent: customerBookings.reduce((sum, booking) => sum + booking.totalAmount, 0)
  } : null;

  const customerReviews = mockReviews.filter(review => review.customerName === customer?.name);

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

  if (!customer) {
    return (
      <Layout>
        <div className="min-h-screen bg-muted/30 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Customer Not Found</h2>
              <p className="text-muted-foreground">No customer found with ID: {customerId}</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

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
            <div className="flex items-center space-x-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl">
                  {customer.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{customer.name}</h1>
                <p className="text-muted-foreground">Customer Profile</p>
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
                    <p className="text-2xl font-bold">{customer.totalBookings}</p>
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
                    <p className="text-2xl font-bold">₹{customer.totalSpent}</p>
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
                    <p className="text-2xl font-bold">{customerReviews.length}</p>
                    <p className="text-sm text-muted-foreground">Reviews Given</p>
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
                      {customerBookings.filter(b => b.status === 'completed').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{customer.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{customer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{customer.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">{customer.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Member Since</p>
                        <p className="font-medium">{new Date(customer.joinedDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerBookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">Booking #{booking.id}</h3>
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
                          <div>
                            <p className="text-muted-foreground">Payment</p>
                            <Badge variant={booking.paymentStatus === 'paid' ? 'success' : 'warning'}>
                              {booking.paymentStatus}
                            </Badge>
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
                    {customerReviews.length > 0 ? (
                      customerReviews.map((review) => (
                        <div key={review.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">Service Review</span>
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
                      <p className="text-muted-foreground text-center py-8">No reviews given yet.</p>
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

export default CustomerProfile;