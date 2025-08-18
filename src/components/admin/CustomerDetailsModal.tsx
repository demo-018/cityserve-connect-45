import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  CreditCard,
  Star,
  TrendingUp
} from 'lucide-react';
import { mockBookings, mockServices } from '@/data/mockData';

interface CustomerDetailsModalProps {
  customerId: string;
  customerName: string;
  isOpen: boolean;
  onClose: () => void;
}

const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  customerId,
  customerName,
  isOpen,
  onClose,
}) => {
  // Get customer's bookings
  const customerBookings = mockBookings.filter(booking => booking.customerId === customerId);
  const totalSpent = customerBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const completedBookings = customerBookings.filter(booking => booking.status === 'completed');
  
  // Mock customer data (in real app, this would come from API)
  const customerData = {
    id: customerId,
    name: customerName,
    email: `${customerName.toLowerCase().replace(' ', '.')}@example.com`,
    phone: '+91 98765 43210',
    address: 'A-123, Green Park Extension, New Delhi - 110016',
    joinDate: '2023-06-15',
    status: 'active',
    rating: 4.8,
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{customerData.name}</h2>
              <p className="text-sm text-muted-foreground">Customer Profile</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Customer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-lg font-bold">{customerBookings.length}</p>
                    <p className="text-xs text-muted-foreground">Total Bookings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-6 h-6 text-success" />
                  <div>
                    <p className="text-lg font-bold">₹{totalSpent}</p>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-info" />
                  <div>
                    <p className="text-lg font-bold">{completedBookings.length}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Star className="w-6 h-6 text-warning" />
                  <div>
                    <p className="text-lg font-bold">{customerData.rating}</p>
                    <p className="text-xs text-muted-foreground">Avg Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-semibold">{customerData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">{customerData.email}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">{customerData.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                      <span className="font-medium">{customerData.address}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">
                        {new Date(customerData.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant="success">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking History */}
          <Card>
            <CardHeader>
              <CardTitle>Booking History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerBookings.map((booking) => {
                  const service = mockServices.find(s => s.id === booking.serviceId);
                  
                  return (
                    <div key={booking.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{service?.name}</h3>
                          <p className="text-sm text-muted-foreground">Booking #{booking.id}</p>
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
                        <div>
                          <p className="text-muted-foreground">Payment</p>
                          <Badge variant={booking.paymentStatus === 'paid' ? 'success' : 'warning'}>
                            {booking.paymentStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {customerBookings.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No bookings found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" className="flex-1">
              Send Message
            </Button>
            <Button variant="hero" className="flex-1">
              View Profile
            </Button>
            <Button variant="destructive" className="flex-1">
              Block Customer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsModal;