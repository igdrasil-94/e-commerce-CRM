import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '../components/shared/PageTransition';
import { BarChart3, TrendingUp, PieChart, Info } from 'lucide-react';

export default function Analytics() {
  const { t } = useTranslation();
  
  return (
    <PageTransition>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-slate-100">{t('analytics.title')}</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1 uppercase tracking-[0.1em] text-[10px] font-bold">{t('analytics.subtitle')}</p>
      </div>

      <div className="p-20 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 card-shadow">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center text-indigo-500 mx-auto mb-6">
          <BarChart3 size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2 font-display uppercase tracking-wider">{t('analytics.module_title')}</h2>
        <p className="text-gray-500 dark:text-slate-400 text-xs uppercase font-bold tracking-widest max-w-sm mx-auto leading-relaxed">
          {t('analytics.module_desc')}
        </p>
      </div>
    </PageTransition>
  );
}
