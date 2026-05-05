import React, { useState, useEffect } from 'react';
import { Search, Bell, HelpCircle, Clock, Moon, Sun } from 'lucide-react';
import { AuthUser } from '../../lib/types';

interface HeaderProps {
  user: AuthUser;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header = ({ user, isDarkMode, onToggleDarkMode }: HeaderProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <header className="h-20 border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-6 flex-1">
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 text-gray-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">
            <Clock size={14} className="text-indigo-500" />
            <span>{formattedDate}</span>
            <span className="w-1 h-1 bg-gray-300 dark:bg-slate-600 rounded-full"></span>
            <span className="text-gray-900 dark:text-slate-200">{formattedTime}</span>
        </div>

        <div className="flex-1 max-w-md relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
            type="text" 
            placeholder="Quick search..." 
            className="w-full bg-gray-50 dark:bg-slate-800/50 border-none rounded-2xl py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 placeholder:text-gray-400 dark:placeholder:text-slate-600 text-sm transition-all shadow-inner outline-none text-gray-900 dark:text-slate-200"
            />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleDarkMode}
          className="p-2.5 text-gray-400 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-90"
        >
          {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
        </button>
        <button className="p-2.5 text-gray-400 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl relative transition-colors group">
          <Bell size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
        </button>
        <button className="p-2.5 text-gray-400 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <HelpCircle size={20} />
        </button>
        <div className="h-8 w-px bg-gray-200 dark:bg-slate-800 mx-2"></div>
        <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 dark:text-slate-200">{user.name}</p>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-slate-500">{user.role}</p>
            </div>
            <img 
                src={user.avatar} 
                alt="Profile" 
                className="w-10 h-10 rounded-full ring-2 ring-indigo-50 dark:ring-indigo-900/30 shadow-sm"
            />
        </div>
      </div>
    </header>
  );
};
