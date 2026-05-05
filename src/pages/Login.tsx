import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: (email: string, pass: string) => Promise<void>;
  onResetPassword: (email: string) => Promise<void>;
}

export default function Login({ onLogin, onResetPassword }: LoginProps) {
  const [email, setEmail] = useState('kacouesdras@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl border border-gray-100 card-shadow p-8 flex flex-col items-center"
      >
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-indigo-100">
          <Shield size={32} />
        </div>
        
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">{t('login.title')}</h1>
        <p className="text-gray-400 text-sm font-medium mb-8 text-center px-4 uppercase tracking-[0.1em] text-[10px] font-bold">
          {t('login.subtitle')}
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">{t('login.email_label')}</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              placeholder="name@company.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">{t('login.password_label')}</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-indigo-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-50 text-rose-600 text-xs font-bold p-3 rounded-xl border border-rose-100 text-center uppercase tracking-wider"
            >
              {error}
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white rounded-xl py-4 font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : t('login.signin_button')}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-50 w-full flex flex-col items-center gap-4">
          <p className="text-xs text-gray-400 font-medium italic">
            Default credentials: <span className="font-bold text-indigo-400">kacouesdras@gmail.com</span> / <span className="font-bold text-indigo-400">password123</span>
          </p>
          <div className="flex gap-4">
             <button 
               type="button"
               onClick={() => onResetPassword(email)}
               className="text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
             >
               Forgot Password?
             </button>
             <div className="w-1 h-1 bg-gray-200 rounded-full my-auto"></div>
             <button className="text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">Help Center</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
