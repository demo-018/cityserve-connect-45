import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin, Shield, Users, Zap } from 'lucide-react';
import { serviceCategories, mockServices } from '@/data/mockData';
import Layout from '@/components/common/Layout';

const Home = () => {
  const featuredServices = mockServices.slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Your Home Services
            <br />
            <span className="text-primary-light">Delivered with Care</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            From cleaning to repairs, beauty to maintenance - get professional services at your doorstep
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" variant="glass" asChild>
              <Link to="/services">Explore Services</Link>
            </Button>
            <Button size="xl" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30" asChild>
              <Link to="/how-it-works">How it Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Popular Service Categories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional services for every need in your city
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {serviceCategories.map((category) => (
              <Link
                key={category.id}
                to={`/services?category=${category.id}`}
                className="group"
              >
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105 border border-border/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Services
            </h2>
            <p className="text-lg text-muted-foreground">
              Most popular services in your area
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 border border-border/50">
                <div className="aspect-video bg-gradient-card relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-primary/10"></div>
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-foreground">
                      {serviceCategories.find(c => c.id === service.category)?.name}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {service.name}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {service.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="font-medium">{service.rating}</span>
                      <span className="text-muted-foreground text-sm">({service.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration} min</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">₹{service.price}</span>
                    <Button variant="hero" asChild>
                      <Link to={`/services/${service.id}`}>Book Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" asChild>
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose UrbanServe?
            </h2>
            <p className="text-lg text-muted-foreground">
              We make home services simple, reliable, and affordable
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Verified Professionals</h3>
              <p className="text-muted-foreground">All service providers are background verified and trained</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Doorstep Service</h3>
              <p className="text-muted-foreground">Professional services delivered at your convenience</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Trusted by Thousands</h3>
              <p className="text-muted-foreground">Join thousands of satisfied customers across the city</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Zap className="w-16 h-16 mx-auto mb-6 text-primary-light" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Book your first service now and experience the convenience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" variant="glass" asChild>
              <Link to="/services">Book a Service</Link>
            </Button>
            <Button size="xl" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30" asChild>
              <Link to="/login">Become a Provider</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;