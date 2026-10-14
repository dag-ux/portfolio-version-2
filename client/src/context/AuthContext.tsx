import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { loginAdmin, verifyAdmin, getToken, setToken, clearToken } from '../services/adminApi';

interface AuthContextValue {
  isAuthenticated: boolean;
  email: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    verifyAdmin()
      .then((data) => {
        setIsAuthenticated(true);
        setEmail(data.email);
      })
      .catch(() => {
        clearToken();
        setIsAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (emailInput: string, password: string) => {
    const data = await loginAdmin(emailInput, password);
    setToken(data.token);
    setEmail(data.email);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearToken();
    setIsAuthenticated(false);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, email, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}