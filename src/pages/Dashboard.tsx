import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users as UsersIcon, 
  ShoppingBag, 
  Package, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  MoreVertical,
  ChevronRight,
  FileDown,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AppData, cn, downloadCSV } from '../lib/types';
import { PageTransition } from '../components/shared/PageTransition';

export default function Dashboard({ data }: { data: AppData }) {
  const [exporting, setExporting] = useState(false);
  const { t } = useTranslation();

  const stats = [
    { label: t('dashboard.revenue'), value: `€${data.stats.dashboard.totalRevenue.value.toLocaleString()}`, trend: data.stats.dashboard.totalRevenue.trend, icon: DollarSign, color: 'emerald' },
    { label: t('common.orders'), value: data.stats.dashboard.activeOrders.value.toLocaleString(), trend: data.stats.dashboard.activeOrders.trend, icon: ShoppingBag, color: 'indigo' },
    { label: t('dashboard.active_customers'), value: data.stats.dashboard.newCustomers.value.toLocaleString(), trend: data.stats.dashboard.newCustomers.trend, icon: UsersIcon, color: 'blue' },
    { label: t('catalog.inventory_alerts', 'Inventory Alerts'), value: data.stats.dashboard.inventoryAlerts.value.toLocaleString(), trend: data.stats.dashboard.inventoryAlerts.trend, icon: Package, color: 'amber' },
  ];

  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => {
        downloadCSV(data.activities, `lumina_sales_report_${new Date().toISOString().split('T')[0]}.csv`);
        setExporting(false);
    }, 600);
  };

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-gray-100">{t('dashboard.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest text-[10px] font-bold">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl font-bold text-xs hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-sm text-gray-500 dark:text-slate-400 uppercase tracking-widest">
                <Clock size={16} className="text-indigo-500" /> Fiscal Period
            </button>
            <button 
                onClick={handleExportCSV}
                disabled={exporting}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none disabled:opacity-50 uppercase tracking-widest"
            >
                {exporting ? <Clock size={16} className="animate-spin" /> : <FileDown size={16} />} 
                {exporting ? t('common.loading') : t('orders.export')}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx} 
            className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 card-shadow group relative overflow-hidden transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={cn(
                "p-3 rounded-2xl transition-transform group-hover:scale-110 duration-500",
                stat.color === 'indigo' && "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
                stat.color === 'blue' && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
                stat.color === 'emerald' && "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
                stat.color === 'amber' && "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
              )}>
                <stat.icon size={20} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg",
                stat.trend >= 0 ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-rose-50 dark:bg-rose-900/20 text-rose-600"
              )}>
                {stat.trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {Math.abs(stat.trend)}%
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 tracking-[0.2em] mb-1 uppercase">{stat.label}</p>
              <p className="text-3xl font-bold font-display text-gray-900 dark:text-gray-100">{stat.value}</p>
            </div>
            <div className="absolute -bottom-6 -right-6 text-gray-50 dark:text-slate-800 group-hover:text-indigo-50 dark:group-hover:text-indigo-900/10 group-hover:scale-125 transition-all duration-700 pointer-events-none">
              <stat.icon size={120} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 p-8 card-shadow">
          <div className="flex items-center justify-between mb-10">
            <h3 className="font-bold font-display text-lg text-gray-900 dark:text-gray-100">Conversion Telemetry</h3>
            <div className="flex bg-gray-50 dark:bg-slate-800 p-1 rounded-xl">
                <button className="px-3 py-1.5 bg-white dark:bg-slate-700 text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 rounded-lg shadow-sm">Daily</button>
                <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 hover:text-gray-600 transition-colors">Monthly</button>
            </div>
          </div>
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData}>
                <CartesianGrid vertical={false} stroke="#94a3b8" strokeOpacity={0.1} strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-2xl rounded-2xl p-4">
                          <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 mb-2 uppercase tracking-widest">{payload[0].payload.day}</p>
                          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 font-display">€{payload[0].value} <span className="text-xs font-sans text-gray-400 font-bold uppercase tracking-widest">Revenue</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={44}>
                  {data.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 5 ? '#6366F1' : '#E2E8F0'} className="dark:fill-slate-700" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 p-8 card-shadow flex flex-col">
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <TrendingUp size={20} />
                </div>
                <h3 className="font-bold font-display text-lg text-gray-900 dark:text-gray-100">Logistics Health</h3>
            </div>
            <div className="space-y-8 mb-10">
                {[
                    { label: 'Inventory Sync', value: 92, color: 'bg-indigo-500' },
                    { label: 'Payment API', value: 98, color: 'bg-emerald-500' },
                    { label: 'Shipping Hooks', value: 87, color: 'bg-amber-500' },
                    { label: 'Fraud Detection', value: 99, color: 'bg-indigo-300 dark:bg-indigo-500/40' }
                ].map((item, id) => (
                    <div key={id}>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">{item.label}</span>
                            <span className="text-xs font-bold text-gray-900 dark:text-slate-200">{item.value}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-50 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${item.value}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className={cn("h-full rounded-full transition-all duration-1000", item.color)} 
                            />
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-auto py-4 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-slate-700 transition-all active:scale-95">
                Full Systems Diagnostics
            </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 card-shadow overflow-hidden">
        <div className="p-8 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold font-display text-lg text-gray-900 dark:text-gray-100">Live Sales Stream</h3>
            <div className="flex gap-2">
                <button className="p-2.5 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-750 rounded-xl text-gray-400 dark:text-slate-500 transition-colors"><Filter size={18} /></button>
                <button className="p-2.5 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-750 rounded-xl text-gray-400 dark:text-slate-500 transition-colors"><MoreVertical size={18} /></button>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-50/50 dark:bg-slate-800/20 text-[10px] uppercase font-bold text-gray-400 dark:text-slate-500 tracking-[0.2em]">
                        <th className="px-8 py-5">{t('common.customers')}</th>
                        <th className="px-8 py-5">{t('common.actions')}</th>
                        <th className="px-8 py-5">{t('common.date')}</th>
                        <th className="px-8 py-5">{t('common.total')}</th>
                        <th className="px-8 py-5">{t('common.status')}</th>
                        <th className="px-8 py-5"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                    {data.activities.map((act) => (
                        <tr key={act.id} className="group hover:bg-indigo-50/10 dark:hover:bg-slate-800/10 transition-colors">
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs uppercase shadow-sm group-hover:scale-105 transition-transform">
                                        {act.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight mb-0.5">{act.customerName}</p>
                                        <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">{act.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                <span className="text-sm text-gray-600 dark:text-slate-400 font-bold tracking-tight">{act.action}</span>
                            </td>
                            <td className="px-8 py-5">
                                <span className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">{act.date}</span>
                            </td>
                            <td className="px-8 py-5">
                                <span className="text-sm font-bold text-gray-900 dark:text-gray-100 font-display">€{act.total.toFixed(2)}</span>
                            </td>
                            <td className="px-8 py-5">
                                <div className={cn(
                                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider border",
                                    act.status === 'Completed' && "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-500 border-emerald-100 dark:border-emerald-900/30",
                                    act.status === 'Processing' && "bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-500 border-amber-100 dark:border-amber-900/30",
                                    act.status === 'Cancelled' && "bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-500 border-rose-100 dark:border-rose-900/30",
                                    act.status === 'Shipped' && "bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-500 border-indigo-100 dark:border-indigo-900/30",
                                )}>
                                    <span className="w-1 h-1 rounded-full bg-current"></span>
                                    {act.status}
                                </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                                <button className="p-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 text-gray-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400">
                                    <ChevronRight size={20} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </PageTransition>
  );
}
