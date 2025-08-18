import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin, CreditCard, Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, isToday, isTomorrow } from 'date-fns';

interface Provider {
  id: string;
  name: string;
  location: string;
  services: string[];
  rating: number;
  totalReviews: number;
  hourlyRate: number;
  responseTime: string;
  isAvailable: boolean;
}

interface BookingModalProps {
  provider: Provider | null;
  isOpen: boolean;
  onClose: () => void;
}

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM', '07:00 PM'
];

const BookingModal: React.FC<BookingModalProps> = ({ provider, isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [duration, setDuration] = useState('2');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !selectedService || !address || !phone || !paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Mock booking creation
    const bookingData = {
      id: `booking_${Date.now()}`,
      providerId: provider?.id,
      providerName: provider?.name,
      service: selectedService,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      duration: parseInt(duration),
      address,
      phone,
      notes,
      paymentMethod,
      totalAmount: (provider?.hourlyRate || 0) * parseInt(duration),
      status: 'pending'
    };

    // Store booking in localStorage for demo
    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    existingBookings.push(bookingData);
    localStorage.setItem('userBookings', JSON.stringify(existingBookings));

    toast({
      title: "Booking Confirmed!",
      description: `Your booking with ${provider?.name} has been confirmed for ${format(selectedDate, 'MMM dd, yyyy')} at ${selectedTime}`,
    });

    onClose();
    setStep(1);
    // Reset form
    setSelectedTime('');
    setSelectedService('');
    setAddress('');
    setPhone('');
    setNotes('');
    setPaymentMethod('');
  };

  const calculateTotal = () => {
    return (provider?.hourlyRate || 0) * parseInt(duration);
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd');
  };

  if (!provider) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Service with {provider.name}</DialogTitle>
        </DialogHeader>

        {/* Provider Info */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{provider.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {provider.location}
                </div>
                <div className="flex items-center mt-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="ml-1 text-sm font-medium">{provider.rating}</span>
                  <span className="ml-1 text-sm text-muted-foreground">
                    ({provider.totalReviews} reviews)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">₹{provider.hourlyRate}/hr</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {provider.responseTime}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {step === 1 && (
          <div className="space-y-6">
            {/* Service Selection */}
            <div className="space-y-2">
              <Label htmlFor="service">Select Service *</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {provider.services.map((service, index) => (
                    <SelectItem key={index} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Select Date *</Label>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {Array.from({ length: 7 }, (_, i) => {
                  const date = addDays(new Date(), i);
                  return (
                    <Button
                      key={i}
                      variant={selectedDate.toDateString() === date.toDateString() ? "default" : "outline"}
                      className="flex flex-col h-auto py-3"
                      onClick={() => setSelectedDate(date)}
                    >
                      <span className="text-xs">{getDateLabel(date)}</span>
                      <span className="text-sm font-medium">{format(date, 'dd')}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <Label>Select Time *</Label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (hours) *</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="3">3 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="8">8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={() => setStep(2)}
                disabled={!selectedService || !selectedTime}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {/* Contact Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Service Address *</Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your complete address"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Special Instructions (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions for the service provider"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)}>
                Continue to Payment
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-medium">{selectedService}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span className="font-medium">
                    {format(selectedDate, 'MMM dd, yyyy')} at {selectedTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{duration} hour(s)</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate:</span>
                  <span className="font-medium">₹{provider.hourlyRate}/hour</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label>Payment Method *</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={paymentMethod === 'razorpay' ? "default" : "outline"}
                  className="flex items-center justify-center space-x-2 h-12"
                  onClick={() => setPaymentMethod('razorpay')}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Razorpay</span>
                </Button>
                <Button
                  variant={paymentMethod === 'cod' ? "default" : "outline"}
                  className="flex items-center justify-center space-x-2 h-12"
                  onClick={() => setPaymentMethod('cod')}
                >
                  <span>💵</span>
                  <span>Cash on Delivery</span>
                </Button>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={handleBooking} className="bg-gradient-primary">
                Confirm Booking - ₹{calculateTotal()}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;