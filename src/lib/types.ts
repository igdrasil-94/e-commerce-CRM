import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function downloadCSV(data: any[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => JSON.stringify(row[header] ?? '')).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export interface DashboardStats {
  totalRevenue: { value: number; trend: number };
  activeOrders: { value: number; trend: number };
  newCustomers: { value: number; trend: number };
  inventoryAlerts: { value: number; trend: number };
}

export interface CustomerStats {
  total: number;
  active: number;
  vip: number;
  churned: number;
}

export interface Activity {
  id: string;
  customerName: string;
  email: string;
  action: string;
  date: string;
  total: number;
  status: 'Completed' | 'Processing' | 'Shipped' | 'Cancelled';
  avatar: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  tier: 'Standard' | 'Silver' | 'Gold' | 'Platinum';
  status: 'Active' | 'Inactive';
  avatar: string;
  totalSpent: number;
  lastOrderDate: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  status: 'Available' | 'Low Stock' | 'Out of Stock';
  image: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: { productId: string; name: string; quantity: number; price: number }[];
  total: number;
  status: 'Pending' | 'Paid' | 'Shipped' | 'Delivered' | 'Returned';
  createdAt: string;
  trackingNumber?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Support' | 'Inventory';
  avatar: string;
}

export interface AppData {
  stats: {
    dashboard: DashboardStats;
    customers: CustomerStats;
  };
  activities: Activity[];
  customers: Customer[];
  products: Product[];
  orders: Order[];
  chartData: { day: string; value: number }[];
  settings: {
    localization: { language: string; region: string };
    quickConfig: { twoFactorAuth: boolean; maintenanceMode: boolean; emailNotifications: boolean };
  };
  auth: {
    users: any[];
  }
}
