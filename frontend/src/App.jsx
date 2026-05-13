import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Cours from './pages/Cours';
import Entretien from './pages/Entretien';
import Agent from './pages/Agent';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}
function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}
function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login"    element={user ? <Navigate to="/dashboard"/> : <Login/>} />
      <Route path="/register" element={user ? <Navigate to="/dashboard"/> : <Register/>} />
      <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard/></Layout></PrivateRoute>} />
      <Route path="/cours"     element={<PrivateRoute><Layout><Cours/></Layout></PrivateRoute>} />
      <Route path="/entretien" element={<PrivateRoute><Layout><Entretien/></Layout></PrivateRoute>} />
      <Route path="/agent"     element={<PrivateRoute><Layout><Agent/></Layout></PrivateRoute>} />
      <Route path="*"          element={<Navigate to={user ? '/dashboard' : '/login'}/>} />
    </Routes>
  );
}
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter><AppRoutes /></BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
