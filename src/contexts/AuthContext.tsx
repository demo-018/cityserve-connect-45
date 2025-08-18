import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'provider' | 'admin';
  avatar?: string;
  phone?: string;
  address?: string;
  pincode?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Demo users with credentials
const DEMO_USERS: Record<string, User> = {
  'customer@demo.com': {
    id: '1',
    email: 'customer@demo.com',
    name: 'Rajesh Kumar',
    role: 'customer',
    phone: '+91 98765 43210',
    address: 'A-123, Green Park Extension',
    pincode: '110016'
  },
  'provider@demo.com': {
    id: '2',
    email: 'provider@demo.com', 
    name: 'Priya Sharma',
    role: 'provider',
    phone: '+91 87654 32109',
    address: 'B-456, Lajpat Nagar',
    pincode: '110024'
  },
  'admin@demo.com': {
    id: '3',
    email: 'admin@demo.com',
    name: 'Admin User',
    role: 'admin',
    phone: '+91 76543 21098'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('urbanServices_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Demo login - password is always "demo123"
    if (password === 'demo123' && DEMO_USERS[email]) {
      const loggedInUser = DEMO_USERS[email];
      setUser(loggedInUser);
      localStorage.setItem('urbanServices_user', JSON.stringify(loggedInUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('urbanServices_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};