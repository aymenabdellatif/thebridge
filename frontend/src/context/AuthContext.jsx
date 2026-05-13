import { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(null);
  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (t && u) { setToken(t); setUser(JSON.parse(u)); }
  }, []);
  const login = (u, t) => {
    setUser(u); setToken(t);
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
  };
  const logout = () => {
    setUser(null); setToken(null);
    localStorage.removeItem('token'); localStorage.removeItem('user');
  };
  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
