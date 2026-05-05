import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AppData, Customer, Product, Order } from './lib/types';
import { ToastContainer, ToastType } from './components/shared/Toast';

// Layout & Components
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Payments from './pages/Payments';
import Delivery from './pages/Delivery';
import Marketing from './pages/Marketing';
import Analytics from './pages/Analytics';
import Admin from './pages/Admin';
import Settings from './pages/Settings';

export default function App() {
  const { user, login, logout, loading: authLoading } = useAuth();
  const [data, setData] = useState<AppData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [toasts, setToasts] = useState<{ id: string; message: string; type: ToastType }[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleResetPassword = async (email: string) => {
    addToast(`Password reset link sent to ${email}`, "info");
  };

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      const val = await res.json();
      setData(val);
    } catch (err) {
      console.error("Failed to fetch app data", err);
      addToast("Connection to central nexus severed", "error");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogin = async (email: string, pass: string) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    
    if (!res.ok) {
      const err = await res.json();
      addToast(err.error || "Authentication failed", "error");
      throw new Error(err.error);
    }
    
    const { user: userData } = await res.json();
    login(userData);
    addToast(`Access granted. Welcome, ${userData.name}`, "success");
  };

  const handleLogout = () => {
    logout();
    addToast("Session terminated", "info");
  };

  const handleAddCustomer = async (newCustomer: Partial<Customer>) => {
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCustomer)
    });
    if (res.ok) {
      await fetchData();
      addToast("New customer profiling complete", "success");
    } else {
      addToast("Failed to register customer", "error");
    }
  };

  const handleAddProduct = async (newProduct: Partial<Product>) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });
    if (res.ok) {
      await fetchData();
      addToast("Inventory catalog updated", "success");
    } else {
      addToast("Failed to provision product", "error");
    }
  };

  const handleUpdateProduct = async (id: string, updatedProduct: Partial<Product>) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct)
    });
    if (res.ok) {
      await fetchData();
      addToast("Product specifications modified", "success");
    } else {
      addToast("Failed to update product", "error");
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      await fetchData();
      addToast(`Order ${orderId} updated to ${status}`, "success");
    } else {
      addToast("Failed to update order status", "error");
    }
  };

  if (authLoading || dataLoading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC] flex-col gap-6">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>
            </div>
        </div>
        <div className="flex flex-col items-center gap-1 text-center px-6">
            <p className="font-bold text-gray-900 uppercase tracking-[0.2em] text-[10px]">Initializing Nexus OS</p>
            <p className="text-gray-400 text-[10px] font-medium tracking-widest uppercase">Synchronizing with node: CLOUD-ALPHA...</p>
        </div>
    </div>
  );

  if (!data) return (
    <div className="h-screen w-full flex items-center justify-center text-rose-500 font-bold bg-[#F8FAFC] flex-col gap-4">
        <div className="w-16 h-16 bg-rose-50 flex items-center justify-center rounded-2xl border border-rose-100">
          <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
        </div>
        <p className="tracking-widest uppercase text-xs">Error: Sync Handshake Failed</p>
    </div>
  );

  return (
    <BrowserRouter>
      {user ? (
        <div className="min-h-screen bg-[#F8FAFC] flex">
          <Sidebar user={user} onLogout={handleLogout} />
          <main className="min-h-screen flex-1">
            <Header user={user} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
            <div className="p-8 max-w-[1600px] mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard data={data} />} />
                <Route path="/orders" element={<Orders data={data} onUpdateOrderStatus={handleUpdateOrderStatus} />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/delivery" element={<Delivery />} />
                <Route path="/customers" element={<Customers data={data} onAddCustomer={handleAddCustomer} />} />
                <Route path="/products" element={<Products data={data} onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} />} />
                <Route path="/marketing" element={<Marketing />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings data={data} addToast={addToast} onResetPassword={handleResetPassword} user={user} />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
      ) : (
        <>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} onResetPassword={handleResetPassword} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </>
      )}
    </BrowserRouter>
  );
}
