import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (only accessible when not authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const AppRoutes = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute>
          <Signup />
        </PublicRoute>
      } />
      <Route path="/cart" element={
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Layout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
