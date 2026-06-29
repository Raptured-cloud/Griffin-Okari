import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import Home          from './pages/Home';
import Shop          from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart          from './pages/Cart';
import Auth          from './pages/Auth';
import Admin         from './pages/Admin';
import Unauthorized  from './pages/Unauthorized';
import Profile       from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/"             element={<Home />} />
              <Route path="/shop"         element={<Shop />} />
              <Route path="/product/:id"  element={<ProductDetail />} />
              <Route path="/cart"         element={<Cart />} />
              <Route path="/auth"         element={<Auth />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/profile"      element={<Profile />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
