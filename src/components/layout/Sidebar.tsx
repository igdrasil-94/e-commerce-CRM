import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Users as UsersIcon, 
  Settings as SettingsIcon, 
  ShoppingBag, 
  Package,
  Shield,
  LogOut,
  AlertTriangle,
  X,
  CreditCard,
  Truck,
  Megaphone,
  BarChart3,
  ChevronRight,
  Menu,
  ChevronLeft,
  Search,
  Plus,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, AuthUser } from '../../lib/types';

interface SidebarProps {
  user: AuthUser;
  onLogout: () => void;
}

interface NavItem {
  to: string;
  icon: any;
  label: string;
  roles?: string[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar = ({ user, onLogout }: SidebarProps) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  
  const sections: NavSection[] = [
    {
      title: t('common.general'),
      items: [
        { to: '/', icon: LayoutDashboard, label: t('common.dashboard') },
      ]
    },
    {
      title: t('common.sales'),
      items: [
        { to: '/orders', icon: ShoppingBag, label: t('common.orders'), roles: ['Admin', 'Support'] },
        { to: '/payments', icon: CreditCard, label: t('common.payments'), roles: ['Admin', 'Support'] },
        { to: '/delivery', icon: Truck, label: t('common.delivery'), roles: ['Admin', 'Inventory'] },
      ]
    },
    {
      title: t('common.catalog'),
      items: [
        { to: '/products', icon: Package, label: t('common.products'), roles: ['Admin', 'Inventory'] },
      ]
    },
    {
      title: t('common.customers'),
      items: [
        { to: '/customers', icon: UsersIcon, label: t('common.customers'), roles: ['Admin', 'Support'] },
      ]
    },
    {
      title: t('common.marketing'),
      items: [
        { to: '/marketing', icon: Megaphone, label: t('common.marketing'), roles: ['Admin'] },
      ]
    },
    {
      title: t('common.analytics'),
      items: [
        { to: '/analytics', icon: BarChart3, label: t('common.analytics'), roles: ['Admin'] },
      ]
    },
    {
      title: t('common.system'),
      items: [
        { to: '/settings', icon: SettingsIcon, label: t('common.settings') },
        { to: '/admin', icon: Shield, label: t('common.admin'), roles: ['Admin'] },
      ]
    }
  ];

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(nextLang);
  };

  const filterItems = (items: NavItem[]) => {
    return items.filter(item => !item.roles || item.roles.includes(user.role));
  };

  const filteredSections = sections.map(section => ({
    ...section,
    items: filterItems(section.items)
  })).filter(section => section.items.length > 0);

  return (
    <>
      <aside 
        className={cn(
          "bg-white dark:bg-slate-900 h-screen fixed left-0 top-0 flex flex-col z-40 transition-all duration-300 border-r border-gray-100 dark:border-slate-800",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-full flex items-center justify-center text-gray-400 hover:text-indigo-600 shadow-sm z-50 group transition-all"
        >
          {isCollapsed ? <ChevronRight size={14} className="group-hover:translate-x-0.5" /> : <ChevronLeft size={14} className="group-hover:-translate-x-0.5" />}
        </button>

        {/* Branding */}
        <div className={cn(
          "p-6 flex items-center gap-4 transition-all duration-300",
          isCollapsed ? "justify-center" : "justify-start"
        )}>
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 dark:shadow-none flex-shrink-0">
            <CreditCard size={28} />
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="min-w-0"
            >
              <h1 className="font-display font-bold text-xl leading-tight text-gray-900 dark:text-slate-100 tracking-tight">Lumina</h1>
              <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-[0.2em]">Nexus OS</p>
            </motion.div>
          )}
        </div>

        {/* Quick Search (only if not collapsed) */}
        {!isCollapsed && (
          <div className="px-6 mb-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
              <input 
                type="text" 
                placeholder={t('sidebar.quick_access')}
                className="w-full bg-gray-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-100 dark:focus:border-indigo-900/40 rounded-xl pl-9 pr-4 py-2.5 text-[11px] font-bold uppercase tracking-wider outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
        )}

        <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto custom-scrollbar">
          {filteredSections.map((section, idx) => (
            <div key={idx} className="space-y-2">
              {!isCollapsed && (
                <p className="px-4 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      title={isCollapsed ? link.label : undefined}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group",
                        isActive 
                          ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none" 
                          : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-slate-100"
                      )}
                    >
                      <link.icon size={20} className={cn(
                        "transition-transform flex-shrink-0",
                        isActive ? "scale-110" : "group-hover:scale-110"
                      )} />
                      {!isCollapsed && (
                        <span className="text-sm font-bold tracking-tight">{link.label}</span>
                      )}
                      
                      {isActive && !isCollapsed && (
                        <motion.div 
                          layoutId="active-indicator"
                          className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-200" 
                        />
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer / User Profile */}
        <div className={cn(
          "p-4 mt-auto border-t border-gray-50 dark:border-slate-800 space-y-4",
          isCollapsed ? "items-center" : ""
        )}>
          {!isCollapsed && (
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-4 flex items-center gap-3 border border-gray-100/50 dark:border-slate-800">
              <div className="relative">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 shadow-sm"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900 dark:text-slate-100 truncate leading-none mb-1">{user.name}</p>
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest truncate">{user.role}</p>
              </div>
                <button 
                  onClick={toggleLanguage}
                  className="p-2 text-gray-400 hover:text-indigo-500 transition-colors flex items-center gap-2"
                  title={i18n.language === 'en' ? 'Passer en Français' : 'Switch to English'}
                >
                  <Languages size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{i18n.language.toUpperCase()}</span>
                </button>
                <button 
                  onClick={() => setShowLogoutConfirm(true)}
                  className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                  title={t('common.logout')}
                >
                  <LogOut size={16} />
                </button>
            </div>
          )}

          {isCollapsed && (
            <div className="flex flex-col gap-4">
              <button 
                onClick={toggleLanguage}
                className="w-12 h-12 flex flex-col items-center justify-center text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 rounded-2xl transition-all mx-auto"
              >
                <Languages size={18} />
                <span className="text-[8px] font-bold uppercase mt-1">{i18n.language.toUpperCase()}</span>
              </button>
              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="w-12 h-12 flex items-center justify-center text-gray-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 rounded-2xl transition-all mx-auto"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}

          {!isCollapsed && (
            <div className="flex items-center justify-between px-2">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">v4.0.2 Stable</p>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Spacing for main content */}
      <div className={cn("transition-all duration-300", isCollapsed ? "w-20" : "w-72")} />

      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl relative z-10 p-10 flex flex-col items-center text-center border border-gray-100 dark:border-slate-800"
            >
              <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-rose-100 dark:shadow-none">
                <AlertTriangle size={48} />
              </div>
              <h3 className="text-3xl font-bold font-display text-gray-900 dark:text-slate-100 mb-2">{t('sidebar.end_session')}</h3>
              <p className="text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-10 leading-relaxed">
                {t('sidebar.end_session_desc')}
              </p>
              <div className="flex w-full gap-4">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-5 bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-3xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-slate-750 transition-all active:scale-95"
                >
                  {t('common.discard')}
                </button>
                <button 
                  onClick={onLogout}
                  className="flex-1 py-5 bg-rose-500 text-white rounded-3xl font-bold text-[10px] uppercase tracking-widest shadow-2xl shadow-rose-100 dark:shadow-none hover:bg-rose-600 transition-all active:scale-95"
                >
                  {t('sidebar.terminate')}
                </button>
              </div>
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="absolute top-8 right-8 p-3 text-gray-300 hover:text-gray-500 transition-colors"
              >
                <X size={24} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
