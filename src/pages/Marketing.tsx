import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '../components/shared/PageTransition';
import { Megaphone, Tag, Zap, MessageSquare } from 'lucide-react';

export default function Marketing() {
  const { t } = useTranslation();
  
  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-slate-100">{t('marketing.title')}</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1 uppercase tracking-[0.1em] text-[10px] font-bold">{t('marketing.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: t('marketing.ctr'), value: '4.2%', icon: Megaphone, color: 'text-indigo-600 bg-indigo-50' },
          { label: t('marketing.active_coupons'), value: '12', icon: Tag, color: 'text-amber-600 bg-amber-50' },
          { label: t('marketing.automation_flows'), value: '8', icon: Zap, color: 'text-emerald-600 bg-emerald-50' },
          { label: t('marketing.support_inquiries'), value: '24', icon: MessageSquare, color: 'text-blue-600 bg-blue-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.color} dark:bg-indigo-900/10`}>
                <stat.icon size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-slate-100 font-display">{stat.value}</p>
            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="p-20 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 card-shadow">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center text-indigo-500 mx-auto mb-6">
          <Megaphone size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2 font-display uppercase tracking-wider">{t('marketing.module_title')}</h2>
        <p className="text-gray-500 dark:text-slate-400 text-xs uppercase font-bold tracking-widest max-w-sm mx-auto leading-relaxed">
          {t('marketing.module_desc')}
        </p>
      </div>
    </PageTransition>
  );
}
