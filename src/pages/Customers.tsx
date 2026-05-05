import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users as UsersIcon, 
  Shield, 
  TrendingUp, 
  Plus, 
  Search, 
  RefreshCw, 
  Edit2, 
  Trash2, 
  X, 
  Loader2,
  FileDown,
  Filter,
  CreditCard,
  Target,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppData, Customer, cn, downloadCSV } from '../lib/types';
import { PageTransition } from '../components/shared/PageTransition';

export default function Customers({ data, onAddCustomer }: { data: AppData, onAddCustomer: (customer: Partial<Customer>) => Promise<void> }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [tierFilter, setTierFilter] = useState('ALL');
    const [newCustomer, setNewCustomer] = useState({ name: '', email: '', tier: 'Standard', status: 'Active' });
    const [submitting, setSubmitting] = useState(false);
    const { t } = useTranslation();

    const filteredCustomers = data.customers.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                             c.email.toLowerCase().includes(search.toLowerCase());
        const matchesTier = tierFilter === 'ALL' || c.tier === tierFilter;
        return matchesSearch && matchesTier;
    });

    const handleExport = () => {
        downloadCSV(filteredCustomers, `lumina-customers-${new Date().toISOString().split('T')[0]}.csv`);
    };

    const stats = [
        { label: t('customers.market_reach', 'Market Reach'), value: data.stats.customers.total, icon: UsersIcon, color: 'indigo', trend: 12.4 },
        { label: t('customers.active_pulse', 'Active Pulse'), value: data.stats.customers.active, icon: UserCheck, color: 'emerald', trend: 4.2 },
        { label: t('customers.elite_tier', 'Elite Tier'), value: data.stats.customers.vip, icon: Target, color: 'amber', trend: 8.9 },
        { label: t('customers.attrition', 'Attrition'), value: `${data.stats.customers.churned}`, icon: CreditCard, color: 'rose', trend: -2.1 }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onAddCustomer({ 
                ...newCustomer, 
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newCustomer.name}`,
                totalSpent: 0,
                lastOrderDate: new Date().toISOString().split('T')[0]
            } as Partial<Customer>);
            setIsModalOpen(false);
            setNewCustomer({ name: '', email: '', tier: 'Standard', status: 'Active' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <PageTransition>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-slate-100">{t('customers.title', 'Customer Intelligence')}</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1 uppercase tracking-[0.1em] text-[10px] font-bold">{t('customers.subtitle', 'Segmenting market personas and lifecycle analytics.')}</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl font-bold text-xs text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm uppercase tracking-widest"
                    >
                        <FileDown size={14} /> {t('customers.export', 'Export Segment')}
                    </button>
                    <button 
                         onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none uppercase tracking-widest"
                    >
                        <Plus size={18} /> {t('customers.add', 'Provision Entity')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx} 
                        className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 card-shadow relative overflow-hidden group hover:-translate-y-1 transition-all"
                    >
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className={cn(
                                "p-3 rounded-2xl transition-transform group-hover:scale-110 duration-500",
                                stat.color === 'indigo' && "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
                                stat.color === 'emerald' && "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
                                stat.color === 'amber' && "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
                                stat.color === 'rose' && "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400",
                            )}>
                                <stat.icon size={22} />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg",
                                stat.trend > 0 ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : stat.trend < 0 ? "bg-rose-50 dark:bg-rose-900/20 text-rose-600" : "bg-gray-50 dark:bg-slate-800 text-gray-400"
                            )}>
                                {stat.trend > 0 ? <TrendingUp size={12} /> : null}
                                {stat.trend !== 0 ? `${Math.abs(stat.trend)}%` : 'Stable'}
                            </div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold font-display text-gray-900 dark:text-slate-100">{stat.value.toLocaleString()}</p>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] group-hover:rotate-12 transition-all duration-700 pointer-events-none">
                             <stat.icon size={120} />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 card-shadow p-4 mb-6 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[300px] relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Retrieve customer entity by name or endpoint..." 
                        className="w-full bg-gray-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-100 dark:focus:border-indigo-900/30 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-4 focus:ring-indigo-100/10 dark:focus:ring-indigo-900/10 text-sm transition-all shadow-inner outline-none text-gray-900 dark:text-slate-200"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-600 pointer-events-none" size={16} />
                        <select 
                            value={tierFilter}
                            onChange={(e) => setTierFilter(e.target.value)}
                            className="bg-gray-50 dark:bg-slate-800/50 border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-slate-400 transition-all outline-none appearance-none cursor-pointer min-w-[160px]"
                        >
                            <option value="ALL">All Persona Tiers</option>
                            <option value="Platinum">Platinum Elite</option>
                            <option value="Gold">Gold Class</option>
                            <option value="Silver">Silver Standard</option>
                            <option value="Standard">Standard User</option>
                        </select>
                    </div>
                    <button 
                        onClick={() => {setSearch(''); setTierFilter('ALL');}}
                        className="p-3.5 bg-gray-50 dark:bg-slate-800/50 border border-transparent hover:border-gray-100 dark:hover:border-slate-700 rounded-2xl text-gray-400 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                        title="Reset Parameters"
                    >
                        <RefreshCw size={20} className={cn((search || tierFilter !== 'ALL') && "animate-spin")} />
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 card-shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-slate-800/20 text-[10px] uppercase font-bold text-gray-400 dark:text-slate-500 tracking-[0.2em]">
                                <th className="px-8 py-5">{t('common.customers')}</th>
                                <th className="px-8 py-5 text-right">{t('common.total')}</th>
                                <th className="px-8 py-5">{t('common.tier', 'Persona Tier')}</th>
                                <th className="px-8 py-5">{t('common.status')}</th>
                                <th className="px-8 py-5 text-right font-display uppercase tracking-widest">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="group hover:bg-gray-50/30 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <img src={customer.avatar} className="w-12 h-12 rounded-2xl border-2 border-white dark:border-slate-800 shadow-sm group-hover:scale-105 transition-transform" alt={customer.name} />
                                                    <div className={cn(
                                                        "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 shadow-sm",
                                                        customer.status === 'Active' ? "bg-emerald-500" : "bg-gray-300 dark:bg-slate-700"
                                                    )}></div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-slate-100 leading-tight mb-0.5">{customer.name}</p>
                                                    <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">{customer.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <p className="text-sm font-bold text-gray-900 dark:text-slate-100 font-display">€{customer.totalSpent.toLocaleString()}</p>
                                            <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">Last Order: {customer.lastOrderDate}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={cn(
                                                "inline-flex px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider shadow-sm",
                                                customer.tier === 'Platinum' && "bg-indigo-600 text-white shadow-indigo-100",
                                                customer.tier === 'Gold' && "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
                                                customer.tier === 'Silver' && "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300",
                                                customer.tier === 'Standard' && "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
                                            )}>
                                                {customer.tier}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className={cn(
                                                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider border transition-all duration-300",
                                                customer.status === 'Active' && "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-500 border-emerald-100 dark:border-emerald-900/40",
                                                customer.status === 'Inactive' && "bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700",
                                            )}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                                                {customer.status}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                                <button className="p-2.5 text-gray-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-slate-700 transition-all"><Edit2 size={16} /></button>
                                                <button className="p-2.5 text-gray-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-slate-700 transition-all"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-gray-400 dark:text-slate-600 shadow-inner">
                                                <Search size={36} />
                                            </div>
                                            <p className="text-gray-900 dark:text-slate-200 font-bold font-display text-xl">Identity Vacuum</p>
                                            <p className="text-gray-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.2em] max-w-[320px] leading-relaxed font-bold">
                                                Zero entities detected within current logical parameters.
                                            </p>
                                            <button 
                                                onClick={() => {setSearch(''); setTierFilter('ALL');}}
                                                className="mt-4 px-6 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-100 rounded-2xl transition-all"
                                            >
                                                Recalibrate Search
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-slate-900/20 dark:bg-slate-900/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl z-[110] overflow-hidden border border-gray-100 dark:border-slate-800"
                        >
                            <div className="p-10 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
                                <h3 className="text-2xl font-bold font-display text-gray-900 dark:text-slate-100 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 dark:shadow-none">
                                        <Plus size={24} />
                                    </div>
                                    Persona Provisioning
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2.5 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-full text-gray-400 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] pl-1">Full Legal Identity</label>
                                        <input 
                                            required
                                            value={newCustomer.name}
                                            onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                                            className="w-full bg-gray-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-100 dark:focus:border-indigo-900/30 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-indigo-100/10 dark:focus:ring-indigo-900/10 transition-all font-semibold text-gray-900 dark:text-slate-200"
                                            placeholder="Specify entity name..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] pl-1">Comms Endpoint (Email)</label>
                                        <input 
                                            required
                                            type="email"
                                            value={newCustomer.email}
                                            onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                                            className="w-full bg-gray-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-100 dark:focus:border-indigo-900/30 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-indigo-100/10 dark:focus:ring-indigo-900/10 transition-all font-semibold text-gray-900 dark:text-slate-200"
                                            placeholder="identity@nex.com"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] pl-1">Asset Tier</label>
                                            <select 
                                                value={newCustomer.tier}
                                                onChange={(e) => setNewCustomer({...newCustomer, tier: e.target.value})}
                                                className="w-full bg-gray-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 font-bold text-[10px] uppercase tracking-[0.15em] text-gray-700 dark:text-slate-300 cursor-pointer"
                                            >
                                                <option>Standard</option>
                                                <option>Silver</option>
                                                <option>Gold</option>
                                                <option>Platinum</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] pl-1">Operational State</label>
                                            <select 
                                                value={newCustomer.status}
                                                onChange={(e) => setNewCustomer({...newCustomer, status: e.target.value})}
                                                className="w-full bg-gray-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 font-bold text-[10px] uppercase tracking-[0.15em] text-gray-700 dark:text-slate-300 cursor-pointer"
                                            >
                                                <option>Active</option>
                                                <option>Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6 flex gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4 text-gray-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-gray-50 dark:bg-slate-800 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-750 transition-all font-display"
                                    >
                                        Abort
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 font-display"
                                    >
                                        {submitting ? <Loader2 className="animate-spin" size={18} /> : <Target size={18} />}
                                        {submitting ? 'Applying Protocols...' : 'Commit Provisioning'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </PageTransition>
    );
}
