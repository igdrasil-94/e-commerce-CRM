import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '../components/shared/PageTransition';
import { ShieldAlert, Terminal, Activity, Lock } from 'lucide-react';

export default function Admin() {
  const { t } = useTranslation();
  
  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-slate-100">{t('admin.title')}</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1 uppercase tracking-[0.1em] text-[10px] font-bold">{t('admin.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
            <h3 className="text-xl font-bold font-display uppercase tracking-widest mb-6">{t('admin.runtime_integrity')}</h3>
            <div className="space-y-4">
                {[
                    { label: t('admin.cpu_load'), status: 'Optimal', value: '14%' },
                    { label: t('admin.mem_alloc'), status: 'Safe', value: '2.4GB' },
                    { label: t('admin.io_wait'), status: 'Nominal', value: '0.2ms' },
                ].map((node, i) => (
                    <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">{node.label}</p>
                            <p className="text-lg font-mono font-bold">{node.value}</p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-bold uppercase tracking-widest">{node.status}</span>
                    </div>
                ))}
            </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 p-8 card-shadow shadow-indigo-100/50">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-500 rounded-2xl">
                    <ShieldAlert size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 font-display uppercase tracking-wider">{t('admin.audit_log')}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('admin.global_access')}</p>
                </div>
            </div>
            <div className="space-y-4">
                {[
                    { event: 'Root Access', user: 'Admin Node #1', time: '2m ago' },
                    { event: 'Config Flush', user: 'Kernel Process', time: '14m ago' },
                    { event: 'Auth Fail', user: '192.168.1.1', time: '45m ago' },
                ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-slate-800 last:border-0">
                        <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-slate-100">{log.event}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{log.user}</p>
                        </div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{log.time}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </PageTransition>
  );
}
