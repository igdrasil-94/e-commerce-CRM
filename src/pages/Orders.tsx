import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Package, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Clock,
  CheckCircle2,
  Truck,
  RotateCcw,
  AlertCircle,
  MoreVertical,
  Download,
  Calendar,
  CreditCard,
  User,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppData, Order, cn, downloadCSV } from '../lib/types';
import { PageTransition } from '../components/shared/PageTransition';

export default function Orders({ data, onUpdateOrderStatus }: { 
  data: AppData,
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'ALL'>('ALL');
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const { t } = useTranslation();

  const toggleOrder = (id: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedOrders(newExpanded);
  };

  const filteredOrders = data.orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase()) || 
                         order.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return { color: 'text-amber-500 bg-amber-50 border-amber-100', icon: Clock };
      case 'Paid': return { color: 'text-emerald-500 bg-emerald-50 border-emerald-100', icon: CreditCard };
      case 'Shipped': return { color: 'text-indigo-500 bg-indigo-50 border-indigo-100', icon: Truck };
      case 'Delivered': return { color: 'text-blue-500 bg-blue-50 border-blue-100', icon: CheckCircle2 };
      case 'Returned': return { color: 'text-rose-500 bg-rose-50 border-rose-100', icon: RotateCcw };
      default: return { color: 'text-slate-500 bg-slate-50 border-slate-100', icon: AlertCircle };
    }
  };

  const handleExport = () => {
    const exportData = filteredOrders.map(o => ({
      ID: o.id,
      Customer: o.customerName,
      Total: o.total,
      Status: o.status,
      Date: new Date(o.createdAt).toLocaleDateString(),
      Items: o.items.map(i => `${i.name} (x${i.quantity})`).join('; ')
    }));
    downloadCSV(exportData, `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-slate-100">{t('orders.title')}</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1 uppercase tracking-[0.1em] text-[10px] font-bold">{t('orders.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 rounded-2xl font-bold text-xs hover:bg-gray-50 dark:hover:bg-slate-750 transition-all shadow-sm uppercase tracking-widest"
          >
            <Download size={18} /> {t('orders.export')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: t('Pending Queue', 'Pending Queue'), value: data.orders.filter(o => o.status === 'Pending').length, icon: Clock, color: 'text-amber-600 bg-amber-50' },
          { label: t('Ready for Dispatch', 'Ready for Dispatch'), value: data.orders.filter(o => o.status === 'Paid').length, icon: CreditCard, color: 'text-emerald-600 bg-emerald-50' },
          { label: t('In Transit', 'In Transit'), value: data.orders.filter(o => o.status === 'Shipped').length, icon: Truck, color: 'text-indigo-600 bg-indigo-50' },
          { label: t('Completed Flow', 'Completed Flow'), value: data.orders.filter(o => o.status === 'Delivered').length, icon: CheckCircle2, color: 'text-blue-600 bg-blue-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-2xl", stat.color, "dark:bg-indigo-900/10")}>
                <stat.icon size={20} />
              </div>
              <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Live Node</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-slate-100 font-display">{stat.value}</p>
            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 card-shadow p-4 mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('orders.search_placeholder')}
            className="w-full bg-gray-50 dark:bg-slate-800/50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm outline-none shadow-inner text-gray-900 dark:text-slate-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400" size={18} />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-gray-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-slate-400 transition-all outline-none appearance-none cursor-pointer min-w-[160px]"
          >
            <option value="ALL">{t('orders.all_states')}</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Returned">Returned</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-800/20 text-[10px] uppercase font-bold text-gray-400 dark:text-slate-500 tracking-[0.2em]">
                <th className="px-8 py-6">{t('common.id')} / {t('common.date')}</th>
                <th className="px-8 py-6">{t('common.customers')}</th>
                <th className="px-8 py-6 text-right">{t('common.total')}</th>
                <th className="px-8 py-6">{t('common.status')}</th>
                <th className="px-8 py-6 text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const isExpanded = expandedOrders.has(order.id);
                  return (
                    <React.Fragment key={order.id}>
                      <tr className={cn(
                        "group transition-colors",
                        isExpanded ? "bg-indigo-50/10 dark:bg-slate-800/20" : "hover:bg-gray-50/50 dark:hover:bg-slate-800/10"
                      )}>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 group-hover:text-indigo-500 transition-colors">
                              <Package size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-slate-100 text-sm leading-none mb-1.5 uppercase font-mono tracking-tighter">{order.id}</p>
                              <div className="flex items-center gap-1.5 text-gray-400 dark:text-slate-500">
                                <Calendar size={12} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{new Date(order.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                              <User size={14} />
                            </div>
                            <span className="font-bold text-gray-900 dark:text-slate-100 text-sm">{order.customerName}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <p className="font-bold text-gray-900 dark:text-slate-100 font-display">€{order.total.toFixed(2)}</p>
                          <p className="text-[9px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">{order.items.length} Units</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className={cn(
                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all",
                            statusInfo.color
                          )}>
                            <statusInfo.icon size={12} />
                            {order.status}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => toggleOrder(order.id)}
                              className="p-2.5 text-gray-400 hover:text-indigo-600 bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-750 rounded-xl transition-all"
                            >
                              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            <div className="relative group/actions">
                              <button className="p-2.5 text-gray-400 hover:text-gray-900 dark:hover:text-slate-100 bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-750 rounded-xl transition-all">
                                <MoreVertical size={18} />
                              </button>
                              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 opacity-0 invisible group-hover/actions:opacity-100 group-hover/actions:visible transition-all z-20 overflow-hidden text-left">
                                {[
                                  { label: 'Move to Paid', status: 'Paid', icon: CheckCircle2 },
                                  { label: 'Dispatch', status: 'Shipped', icon: Truck },
                                  { label: 'Confirm Delivery', status: 'Delivered', icon: CheckCircle2 },
                                  { label: 'Flag Return', status: 'Returned', icon: RotateCcw }
                                ].map((action) => (
                                  <button 
                                    key={action.status}
                                    onClick={() => onUpdateOrderStatus(order.id, action.status as any)}
                                    className="w-full px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-750 flex items-center gap-3 transition-colors"
                                  >
                                    <action.icon size={14} />
                                    {action.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="px-8 py-8 bg-gray-50/30 dark:bg-slate-800/10 border-y border-gray-100/50 dark:border-slate-800">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                              <div>
                                <h4 className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                  <ShoppingBag size={14} /> Detailed Manifest
                                </h4>
                                <div className="space-y-3">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
                                      <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{item.name}</p>
                                        <p className="text-[10px] text-gray-400 dark:text-slate-500 uppercase font-mono tracking-tighter">{item.productId}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">€{(item.price * item.quantity).toFixed(2)}</p>
                                        <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase">Qty: {item.quantity}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                  <Truck size={14} /> Logistics Telemetry
                                </h4>
                                <div className="space-y-4">
                                  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
                                    <div className="space-y-4 relative">
                                      {[
                                        { label: 'Order Processing', date: order.createdAt, done: true },
                                        { label: 'Payment Verified', date: order.status === 'Pending' ? null : order.createdAt, done: order.status !== 'Pending' },
                                        { label: 'Out for Delivery', date: null, done: order.status === 'Shipped' || order.status === 'Delivered' },
                                        { label: 'Handoff Complete', date: null, done: order.status === 'Delivered' }
                                      ].map((step, i) => (
                                        <div key={i} className="flex gap-4 relative">
                                          {i < 3 && <div className={cn("absolute left-2.5 top-6 w-0.5 h-6", step.done ? "bg-emerald-400" : "bg-gray-200 dark:bg-slate-800")}></div>}
                                          <div className={cn(
                                            "w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 z-10",
                                            step.done ? "bg-emerald-400 border-emerald-400 text-white" : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800"
                                          )}>
                                            {step.done && <CheckCircle2 size={10} />}
                                          </div>
                                          <div>
                                            <p className={cn("text-[10px] font-bold uppercase tracking-widest leading-none", step.done ? "text-gray-900 dark:text-slate-100" : "text-gray-400")}>{step.label}</p>
                                            {step.date && <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold">{new Date(step.date).toLocaleString()}</p>}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-gray-300 dark:text-slate-700 shadow-inner">
                        <ShoppingBag size={40} />
                      </div>
                      <p className="text-gray-900 dark:text-slate-200 font-bold font-display text-xl">Logistics Silence</p>
                      <p className="text-gray-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.2em] max-w-[320px] leading-relaxed font-bold">
                        No active order nodes detected matching current filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageTransition>
  );
}
