import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/common/Layout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const demoCredentials = [
    { email: 'customer@demo.com', password: 'demo123', role: 'Customer', description: 'Book and manage services' },
    { email: 'provider@demo.com', password: 'demo123', role: 'Service Provider', description: 'Manage services and bookings' },
    { email: 'admin@demo.com', password: 'demo123', role: 'Admin', description: 'Platform administration' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome back! Redirecting to your dashboard...",
        });
        
        // Redirect based on user role
        const user = JSON.parse(localStorage.getItem('urbanServices_user') || '{}');
        switch (user.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'provider':
            navigate('/provider');
            break;
          default:
            navigate('/customer');
        }
      } else {
        setError('Invalid email or password. Please try the demo credentials below.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
    setIsLoading(true);
    setError('');

    try {
      const success = await login(demoEmail, 'demo123');
      if (success) {
        toast({
          title: "Demo Login Successful",
          description: "Welcome! Redirecting to your dashboard...",
        });
        
        const user = JSON.parse(localStorage.getItem('urbanServices_user') || '{}');
        switch (user.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'provider':
            navigate('/provider');
            break;
          default:
            navigate('/customer');
        }
      }
    } catch (err) {
      setError('Demo login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">U</span>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <p className="text-muted-foreground">
                Sign in to your UrbanServe account
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="hero"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Demo Accounts
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {demoCredentials.map((cred) => (
                  <Card 
                    key={cred.email} 
                    className="p-3 cursor-pointer hover:bg-accent transition-colors border border-border/50"
                    onClick={() => handleDemoLogin(cred.email)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {cred.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {cred.description}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Login
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary hover:underline font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;