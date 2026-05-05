import React from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/types';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

export const ToastContainer = ({ toasts, removeToast }: ToastContainerProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className={cn(
              "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border min-w-[280px] max-w-sm",
              toast.type === 'success' && "bg-white border-emerald-100 text-emerald-800",
              toast.type === 'error' && "bg-white border-rose-100 text-rose-800",
              toast.type === 'info' && "bg-white border-indigo-100 text-indigo-800",
            )}
          >
            <div className={cn(
              "p-1.5 rounded-lg",
              toast.type === 'success' && "bg-emerald-50 text-emerald-600",
              toast.type === 'error' && "bg-rose-50 text-rose-600",
              toast.type === 'info' && "bg-indigo-50 text-indigo-600",
            )}>
              {toast.type === 'success' && <CheckCircle2 size={18} />}
              {toast.type === 'error' && <AlertCircle size={18} />}
              {toast.type === 'info' && <Info size={18} />}
            </div>
            <p className="flex-1 text-sm font-bold">{toast.message}</p>
            <button 
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-gray-50 rounded-lg transition-colors text-gray-400"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
