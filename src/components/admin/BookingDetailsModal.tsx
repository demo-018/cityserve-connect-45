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
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  User,
  Star,
  FileText
} from 'lucide-react';
import { mockServices, mockProviders } from '@/data/mockData';

interface BookingDetailsModalProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
  onCustomerClick?: (customerId: string, customerName: string) => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  isOpen,
  onClose,
  onCustomerClick,
}) => {
  if (!booking) return null;

  const service = mockServices.find(s => s.id === booking.serviceId);
  const provider = mockProviders.find(p => p.id === booking.providerId);

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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-6">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Booking Details #{booking.id}</span>
            <Badge variant={getStatusColor(booking.status) as any}>
              {booking.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Service Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Service Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Service Name</p>
                <p className="font-semibold">{service?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{service?.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{service?.duration} minutes</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Service Rating</p>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                  <span className="font-medium">{service?.rating}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer Name</p>
                   <Button 
                     variant="link" 
                     className="p-0 h-auto font-semibold text-primary hover:underline"
                     onClick={() => window.open(`/customer/profile/${booking.customerId}`, '_blank')}
                   >
                     {booking.customerName}
                   </Button>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium break-all">{booking.customerPhone}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Address</p>
                <div className="flex items-start mt-1">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                  <span className="font-medium">{booking.customerAddress}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Provider Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Provider Information
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <p className="text-sm text-muted-foreground">Provider Name</p>
                   <Button 
                     variant="link" 
                     className="p-0 h-auto font-semibold text-primary hover:underline"
                     onClick={() => window.open(`/provider/profile/${provider?.id}`, '_blank')}
                   >
                     {provider?.name}
                   </Button>
                 </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium break-all">{provider?.phone}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium break-all">{provider?.email}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                    <span className="font-medium">{provider?.rating}</span>
                    <span className="text-sm text-muted-foreground ml-1">
                      ({provider?.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">
                      {new Date(booking.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time Slot</p>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{booking.timeSlot}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <span className="font-medium">
                    {new Date(booking.createdAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <span className="font-medium text-sm break-all">{booking.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">₹{booking.totalAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <Badge variant={getPaymentStatusColor(booking.paymentStatus) as any}>
                    {booking.paymentStatus}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Platform Fee (10%)</p>
                  <p className="font-medium">₹{(booking.totalAmount * 0.1).toFixed(0)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Provider Earnings</p>
                  <p className="font-medium">₹{(booking.totalAmount * 0.9).toFixed(0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button variant="outline" className="flex-1">
              Send Notification
            </Button>
            <Button variant="hero" className="flex-1">
              Update Status
            </Button>
            <Button variant="destructive" className="flex-1">
              Cancel Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsModal;