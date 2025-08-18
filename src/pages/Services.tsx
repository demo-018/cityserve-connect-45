import React, { useState } from 'react';
import Layout from '@/components/common/Layout';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Star, Clock, Filter } from 'lucide-react';
import { serviceCategories, providers } from '@/data/mockData';
import BookingModal from '@/components/booking/BookingModal';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || provider.services.includes(selectedCategory);
    const matchesLocation = selectedLocation === 'all' || provider.location.includes(selectedLocation);
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleBookNow = (provider: any) => {
    setSelectedProvider(provider);
    setIsBookingModalOpen(true);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Find the Perfect Service Provider
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with verified professionals in your area for all your home and personal service needs
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-card rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search services or providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {serviceCategories.map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                  <SelectItem value="Gurgaon">Gurgaon</SelectItem>
                  <SelectItem value="Noida">Noida</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="default" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Service Categories */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Service Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {serviceCategories.map(category => (
                <Card 
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h3 className="font-medium text-sm">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">{category.providers}+ providers</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Service Providers */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Available Providers ({filteredProviders.length})
              </h2>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Sort by:</span>
                <Select defaultValue="rating">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map(provider => (
                <Card key={provider.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {provider.location}
                        </div>
                      </div>
                      <Badge variant={provider.isAvailable ? "success" : "secondary"}>
                        {provider.isAvailable ? "Available" : "Busy"}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="ml-1 text-sm font-medium">{provider.rating}</span>
                        <span className="ml-1 text-sm text-muted-foreground">
                          ({provider.totalReviews} reviews)
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {provider.responseTime}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Services:</p>
                      <div className="flex flex-wrap gap-1">
                        {provider.services.slice(0, 3).map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {provider.services.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{provider.services.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-lg font-bold text-primary">₹{provider.hourlyRate}</span>
                        <span className="text-sm text-muted-foreground">/hour</span>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                        <Button variant="default" size="sm" disabled={!provider.isAvailable} onClick={() => handleBookNow(provider)}>
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProviders.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium text-foreground mb-2">No providers found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or check back later
                </p>
              </div>
            )}
          </div>
        </div>

        <BookingModal
          provider={selectedProvider}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
        />
      </div>
    </Layout>
  );
};

export default Services;