import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Star, MapPin, Phone, Mail, Clock, Award, Calendar } from 'lucide-react';

interface ProviderProfileModalProps {
  provider: any;
  isOpen: boolean;
  onClose: () => void;
}

const ProviderProfileModal: React.FC<ProviderProfileModalProps> = ({
  provider,
  isOpen,
  onClose,
}) => {
  if (!provider) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="font-bold text-primary text-lg">
                {provider.name.split(' ').map((n: string) => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold">{provider.name}</h2>
              <div className="flex items-center space-x-2">
                <Badge variant={provider.isAvailable ? "success" : "secondary"}>
                  {provider.isAvailable ? "Available" : "Busy"}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{provider.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({provider.totalReviews} reviews)
                  </span>
                </div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Contact Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{provider.email || 'provider@example.com'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{provider.phone || '+91 98765 43210'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{provider.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services Offered */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Services Offered</h3>
              <div className="grid grid-cols-2 gap-2">
                {provider.services.map((service: string, index: number) => (
                  <Badge key={index} variant="outline" className="justify-start">
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Professional Details */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Professional Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Hourly Rate</p>
                  <p className="font-semibold text-lg">₹{provider.hourlyRate}/hour</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Response Time</p>
                  <p className="font-medium">{provider.responseTime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="font-medium">{provider.experience || '3+'} years</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Verification</p>
                  <Badge variant={provider.verified ? "success" : "warning"}>
                    {provider.verified ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Availability
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                  <div key={day} className="flex justify-between py-2 border-b">
                    <span className="text-sm">{day}</span>
                    <span className="text-sm font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Recent Reviews</h3>
              <div className="space-y-4">
                {/* Mock reviews */}
                <div className="border-b pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Rajesh Kumar</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-500 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "Excellent service! Very professional and completed the work on time."
                  </p>
                </div>
                <div className="border-b pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Priya Sharma</span>
                    <div className="flex items-center">
                      {[...Array(4)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-500 fill-current"
                        />
                      ))}
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "Good quality work, reasonable pricing. Would recommend!"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button variant="hero" className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Book Now
            </Button>
            <Button variant="outline" className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              Contact
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProviderProfileModal;