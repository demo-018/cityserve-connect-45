import { useState, useEffect } from 'react';

export interface Booking {
  id: string;
  providerId: string;
  providerName: string;
  service: string;
  date: string;
  time: string;
  duration: number;
  address: string;
  phone: string;
  notes: string;
  paymentMethod: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt?: string;
}

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const savedBookings = localStorage.getItem('userBookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  }, []);

  const updateBookingStatus = (bookingId: string, newStatus: Booking['status']) => {
    const updatedBookings = bookings.map(booking =>
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    );
    setBookings(updatedBookings);
    localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
  };

  const cancelBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'cancelled');
  };

  const getBookingsByProvider = (providerId: string) => {
    return bookings.filter(booking => booking.providerId === providerId);
  };

  const getRecentBookings = (limit: number = 5) => {
    return bookings
      .sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime())
      .slice(0, limit);
  };

  return {
    bookings,
    updateBookingStatus,
    cancelBooking,
    getBookingsByProvider,
    getRecentBookings
  };
};