import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, UserPlus, MapPin, Phone, Mail, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/common/Layout';

const Register = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    userType: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.userType) {
      newErrors.userType = 'Please select user type';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors and try again",
        variant: "destructive",
      });
      return;
    }

    // Show success alert with form details
    const formDetails = `Registration Successful!\n\nDetails:\nName: ${formData.fullName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nAddress: ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}\nUser Type: ${formData.userType}`;
    
    alert(formDetails);
    
    toast({
      title: "Registration Successful!",
      description: `Welcome ${formData.fullName}! Your account has been created.`,
    });

    // Reset form
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      address: '',
      pincode: '',
      city: '',
      state: '',
      userType: '',
      agreeToTerms: false,
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 py-8">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="outline" size="sm" asChild>
              <Link to="/login" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Link>
            </Button>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
                <CardDescription>
                  Join CityServe Connect and access quality home services
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Personal Information
                    </h3>
                    
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Enter your full name"
                        className={errors.fullName ? 'border-destructive' : ''}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="your@email.com"
                            className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-sm text-destructive mt-1">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+91 98765 43210"
                            className={`pl-10 ${errors.phone ? 'border-destructive' : ''}`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          placeholder="Enter password"
                          className={errors.password ? 'border-destructive' : ''}
                        />
                        {errors.password && (
                          <p className="text-sm text-destructive mt-1">{errors.password}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          placeholder="Confirm password"
                          className={errors.confirmPassword ? 'border-destructive' : ''}
                        />
                        {errors.confirmPassword && (
                          <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Address Information
                    </h3>
                    
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter your complete address"
                        rows={3}
                        className={errors.address ? 'border-destructive' : ''}
                      />
                      {errors.address && (
                        <p className="text-sm text-destructive mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          value={formData.pincode}
                          onChange={(e) => handleInputChange('pincode', e.target.value)}
                          placeholder="110001"
                          maxLength={6}
                          className={errors.pincode ? 'border-destructive' : ''}
                        />
                        {errors.pincode && (
                          <p className="text-sm text-destructive mt-1">{errors.pincode}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="New Delhi"
                          className={errors.city ? 'border-destructive' : ''}
                        />
                        {errors.city && (
                          <p className="text-sm text-destructive mt-1">{errors.city}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          placeholder="Delhi"
                          className={errors.state ? 'border-destructive' : ''}
                        />
                        {errors.state && (
                          <p className="text-sm text-destructive mt-1">{errors.state}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* User Type */}
                  <div>
                    <Label htmlFor="userType">User Type *</Label>
                    <Select
                      value={formData.userType}
                      onValueChange={(value) => handleInputChange('userType', value)}
                    >
                      <SelectTrigger className={errors.userType ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer - I need services</SelectItem>
                        <SelectItem value="provider">Service Provider - I provide services</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.userType && (
                      <p className="text-sm text-destructive mt-1">{errors.userType}</p>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms and Conditions
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-destructive">{errors.agreeToTerms}</p>
                  )}

                  {/* Submit Button */}
                  <Button type="submit" variant="hero" className="w-full" size="lg">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Create Account
                  </Button>

                  {/* Login Link */}
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      Already have an account?{' '}
                      <Link to="/login" className="text-primary hover:underline font-medium">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;