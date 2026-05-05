import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  ShoppingBag, 
  Package, 
  Cpu, 
  Shirt, 
  ChevronRight, 
  Edit2,
  Trash2, 
  ChevronLeft,
  X,
  Loader2,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock as ClockIcon,
  Tag,
  Warehouse
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppData, Product, cn } from '../lib/types';
import { PageTransition } from '../components/shared/PageTransition';

export default function Products({ data, onAddProduct, onUpdateProduct }: { 
    data: AppData, 
    onAddProduct: (product: Partial<Product>) => Promise<void>,
    onUpdateProduct: (id: string, product: Partial<Product>) => Promise<void>
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [newProduct, setNewProduct] = useState({ name: '', description: '', category: 'Electronics', price: 0, stock: 0, sku: '', status: 'In Stock', image: '' });
    const [submitting, setSubmitting] = useState(false);
    const { t } = useTranslation();

    const filteredProducts = data.products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                             p.description.toLowerCase().includes(search.toLowerCase()) ||
                             p.sku.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
        const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const categories = ['ALL', ...new Set(data.products.map(p => p.category))];
    const statuses = ['ALL', 'In Stock', 'Low Stock', 'Out of Stock'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingProduct) {
                await onUpdateProduct(editingProduct.id, newProduct);
            } else {
                await onAddProduct({
                    ...newProduct,
                    image: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200`
                });
            }
            handleCloseModal();
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setNewProduct({
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            stock: product.stock,
            sku: product.sku,
            status: product.status,
            image: product.image
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setNewProduct({ name: '', description: '', category: 'Electronics', price: 0, stock: 0, sku: '', status: 'In Stock', image: '' });
    };

    const StatusBadge = ({ status, stock }: { status: string, stock: number }) => {
        const s = status.toLowerCase();
        const isInStock = s === 'in stock' && stock > 10;
        const isLowStock = s === 'low stock' || (stock <= 10 && stock > 0);
        const isOutOfStock = s === 'out of stock' || stock === 0;
        
        return (
            <div className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-300",
                isInStock ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30" : 
                isLowStock ? "text-amber-500 bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30" :
                isOutOfStock ? "text-rose-500 bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/30" :
                "text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700"
            )}>
                {isInStock ? <CheckCircle2 size={12} /> : 
                 isLowStock ? <AlertTriangle size={12} className="animate-pulse" /> : 
                 <X size={12} />}
                {isOutOfStock ? t('catalog.out_of_stock', 'OUT OF STOCK') : isLowStock ? t('catalog.low_stock', 'LOW STOCK') : t('catalog.in_stock', 'IN STOCK')}
            </div>
        );
    };

    return (
        <PageTransition>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-slate-100">{t('catalog.title', 'Inventory Nexus')}</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1 uppercase tracking-[0.1em] text-[10px] font-bold">{t('catalog.subtitle', 'Orchestrating SKU allocation and lifecycle telemetry.')}</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none uppercase tracking-widest"
                >
                    <Plus size={18} /> {t('catalog.add_product', 'Provision Product')}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 p-8 card-shadow relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 tracking-[0.2em] uppercase mb-4">{t('catalog.storage_capacity')}</p>
                        <h2 className="text-5xl font-bold font-display mb-2 text-gray-900 dark:text-slate-100">84.5% <span className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 ml-2 tracking-normal font-sans">{t('catalog.warehouse_utilization')}</span></h2>
                        <div className="flex gap-8 mt-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                                    <Warehouse size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">{t('catalog.available_skus')}</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-slate-100">1,284 Entities</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
                                    <AlertTriangle size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase">{t('catalog.alert_state')}</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-slate-100">12 {t('catalog.critical')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 p-12 text-gray-50 dark:text-slate-800 group-hover:text-indigo-50 dark:group-hover:text-indigo-900/10 group-hover:scale-110 transition-all duration-700 pointer-events-none">
                        <Package size={240} />
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden card-shadow">
                    <div className="relative z-10 h-full flex flex-col">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-6">{t('catalog.logistics_flow')}</p>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400">
                                <ShoppingBag size={20} />
                            </div>
                            <h3 className="text-xl font-bold font-display uppercase tracking-widest">{t('catalog.global_order_hub')}</h3>
                        </div>
                        <div className="space-y-4 mb-auto">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-60">
                                <span>{t('catalog.fulfillment_rate')}</span>
                                <span>98.2%</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '98.2%' }}
                                    className="h-full bg-emerald-400"
                                />
                            </div>
                        </div>
                        <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl transition-all mt-8 justify-center">
                            {t('catalog.route_diagnostics')} <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 card-shadow p-4 mb-6 flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[300px] border border-transparent focus-within:border-indigo-100 transition-all rounded-2xl group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input 
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('catalog.search_placeholder')}
                        className="w-full bg-gray-50 dark:bg-slate-800/50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm outline-none shadow-inner text-gray-900 dark:text-slate-200"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                    <div className="relative">
                        <select 
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="bg-gray-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-slate-400 transition-all outline-none appearance-none cursor-pointer min-w-[160px]"
                        >
                            {categories.map(c => <option key={c} value={c}>{c === 'ALL' ? t('catalog.all_categories') : c}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 card-shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-slate-800/20 text-[10px] uppercase font-bold text-gray-400 dark:text-slate-500 tracking-[0.2em]">
                                <th className="px-8 py-6">{t('common.product', 'Product Specification')}</th>
                                <th className="px-8 py-6">{t('common.category', 'Vertical Class')}</th>
                                <th className="px-8 py-6 text-right">{t('common.price', 'Unit Valuation')}</th>
                                <th className="px-8 py-6 text-center">{t('common.stock', 'Quant Asset')}</th>
                                <th className="px-8 py-6">{t('common.status')}</th>
                                <th className="px-8 py-6 text-right font-display uppercase tracking-widest">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((item) => (
                                    <tr key={item.id} className="group hover:bg-indigo-50/10 dark:hover:bg-slate-800/10 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-800 group-hover:scale-105 transition-transform duration-500">
                                                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-slate-100 leading-tight mb-1 text-base">{item.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <Tag size={12} className="text-indigo-400" />
                                                        <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-[0.1em]">{item.sku}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 rounded-xl text-[9px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/40 transition-colors">{item.category}</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className="font-bold text-gray-900 dark:text-slate-100 font-display text-base">€{item.price.toFixed(2)}</p>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <p className={cn(
                                                "font-bold text-base",
                                                item.stock <= 10 ? "text-amber-500" : "text-gray-900 dark:text-slate-100 font-display"
                                            )}>{item.stock}</p>
                                            <p className="text-[9px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">{t('catalog.units_available')}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <StatusBadge status={item.status} stock={item.stock} />
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                                <button 
                                                    onClick={() => handleEdit(item)}
                                                    className="p-3 text-gray-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 rounded-2xl shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-slate-800 transition-all"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button 
                                                    className="p-3 text-gray-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-800 rounded-2xl shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-slate-800 transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-gray-300 dark:text-slate-700 shadow-inner">
                                                <Package size={40} />
                                            </div>
                                            <p className="text-gray-900 dark:text-slate-200 font-bold font-display text-xl">{t('catalog.empty_title')}</p>
                                            <p className="text-gray-400 dark:text-slate-500 text-[10px] uppercase tracking-[0.2em] max-w-[320px] leading-relaxed font-bold">
                                                {t('catalog.empty_desc')}
                                            </p>
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
                            className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/70 backdrop-blur-md z-[100]"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl z-[110] overflow-hidden border border-gray-100 dark:border-slate-800"
                        >
                            <div className="p-10 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
                                <h3 className="text-2xl font-bold font-display text-gray-900 dark:text-slate-100">
                                    {editingProduct ? t('catalog.modal_title_edit') : t('catalog.modal_title_add')}
                                </h3>
                                <button onClick={handleCloseModal} className="p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-full text-gray-400 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] pl-1">{t('catalog.product_designation')}</label>
                                            <input 
                                                required
                                                value={newProduct.name}
                                                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                                                className="w-full bg-gray-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-indigo-100/10 transition-all font-semibold text-gray-900 dark:text-slate-200"
                                                placeholder={t('common.name') + "..."}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] pl-1">{t('catalog.sku_id')}</label>
                                            <input 
                                                required
                                                value={newProduct.sku}
                                                onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                                                className="w-full bg-gray-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-indigo-100/10 transition-all font-semibold text-gray-900 dark:text-slate-200"
                                                placeholder="LUM-XXX-000"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] pl-1">{t('catalog.asset_logic')}</label>
                                        <textarea 
                                            required
                                            value={newProduct.description}
                                            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                                            className="w-full bg-gray-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-indigo-100/10 transition-all font-semibold text-gray-900 dark:text-slate-200 min-h-[100px] resize-none"
                                            placeholder={t('common.description') + "..."}
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] pl-1">{t('catalog.vertical')}</label>
                                            <select 
                                                value={newProduct.category}
                                                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                                                className="w-full bg-gray-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-[10px] uppercase tracking-widest text-gray-700 dark:text-slate-300 cursor-pointer"
                                            >
                                                <option value="Electronics">{t('common.electronics', 'Electronics')}</option>
                                                <option value="Apparel">{t('common.apparel', 'Apparel')}</option>
                                                <option value="Furniture">{t('common.furniture', 'Furniture')}</option>
                                                <option value="Accessories">{t('common.accessories', 'Accessories')}</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] pl-1">{t('catalog.valuation')}</label>
                                            <input 
                                                type="number"
                                                required
                                                value={newProduct.price}
                                                onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                                                className="w-full bg-gray-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-indigo-100/10 transition-all font-bold text-gray-900 dark:text-slate-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] pl-1">{t('catalog.quant_units')}</label>
                                            <input 
                                                type="number"
                                                required
                                                value={newProduct.stock}
                                                onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                                                className="w-full bg-gray-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-indigo-100/10 transition-all font-bold text-gray-900 dark:text-slate-200"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-8 flex gap-4">
                                    <button 
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 py-4 text-gray-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-gray-50 dark:bg-slate-800 rounded-2xl hover:bg-gray-100 transition-all font-display"
                                    >
                                        {t('common.discard')}
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 font-display"
                                    >
                                        {submitting ? <Loader2 className="animate-spin" size={18} /> : <Package size={18} />}
                                        {submitting ? t('catalog.applying') : editingProduct ? t('catalog.sync') : t('catalog.commit')}
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
