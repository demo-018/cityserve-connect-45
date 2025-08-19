import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/enhanced-button';
import { Calendar, Clock, Users, Phone, MapPin } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface BookingsWithPaginationProps {
  bookings: any[];
  providerServices: any[];
  onViewBookingDetails: (booking: any) => void;
  onCustomerClick: (customerId: string, customerName: string) => void;
  getStatusColor: (status: string) => string;
}

const BookingsWithPagination: React.FC<BookingsWithPaginationProps> = ({
  bookings,
  providerServices,
  onViewBookingDetails,
  onCustomerClick,
  getStatusColor
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = bookings.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentBookings.map((booking) => {
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
                      onClick={() => onCustomerClick(booking.customerId, booking.customerName)}
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
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 gap-3">
                    <span className="font-semibold text-foreground">₹{booking.totalAmount}</span>
                    <div className="flex flex-wrap gap-2">
                      {booking.status === 'confirmed' && (
                        <Button variant="hero" size="sm" className="flex-shrink-0">Start Service</Button>
                      )}
                      {booking.status === 'pending' && (
                        <>
                          <Button variant="outline" size="sm" className="flex-shrink-0">Decline</Button>
                          <Button variant="success" size="sm" className="flex-shrink-0">Accept</Button>
                        </>
                      )}
                      <Button variant="outline" size="sm" className="flex-shrink-0">Contact</Button>
                      <Button variant="outline" size="sm" className="flex-shrink-0" onClick={() => onViewBookingDetails(booking)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingsWithPagination;