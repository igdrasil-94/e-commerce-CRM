import React, { useState } from 'react';
import { RefreshCw, Shield, Edit2, HelpCircle, ExternalLink, Loader2, CheckCircle2, Key, Users as UsersIcon, Bell, Monitor } from 'lucide-react';
import { AppData, AuthUser, cn } from '../lib/types';
import { PageTransition } from '../components/shared/PageTransition';
import { ToastType } from '../components/shared/Toast';

interface SettingsProps {
    data: AppData;
    addToast: (msg: string, type: ToastType) => void;
    onResetPassword: (email: string) => Promise<void>;
    user: AuthUser;
}

export default function Settings({ data, addToast, onResetPassword, user }: SettingsProps) {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [settings, setSettings] = useState(data.settings);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            addToast("Platform configurations synchronized and persisted", "success");
            setTimeout(() => setSaved(false), 3000);
        }, 1200);
    };

    const handleReset = async () => {
        await onResetPassword(user.email);
    };

    return (
        <PageTransition>
            <div className="mb-10">
                <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-slate-100">Portal Configurations</h1>
                <p className="text-gray-500 dark:text-slate-400 mt-1 uppercase tracking-widest text-[10px] font-bold">Node: EU-CENTRAL-1 // Internal State: Master</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 p-8 card-shadow">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-sm"><RefreshCw size={20} /></div>
                            <h3 className="font-bold text-xl font-display text-gray-900 dark:text-slate-100">Localization Protocol</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="group">
                                <label className="block text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3 pl-1">Primary Interface Language</label>
                                <select 
                                    value={settings.localization.language}
                                    onChange={(e) => setSettings({...settings, localization: {...settings.localization, language: e.target.value}})}
                                    className="w-full bg-gray-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-100 dark:focus:border-indigo-900/30 rounded-xl px-4 py-3.5 font-bold text-gray-700 dark:text-slate-300 focus:ring-4 focus:ring-indigo-100/10 dark:focus:ring-indigo-900/10 outline-none transition-all cursor-pointer appearance-none shadow-inner"
                                >
                                    <option>English (UK)</option>
                                    <option>French (FR)</option>
                                    <option>German (DE)</option>
                                    <option>Spanish (ES)</option>
                                </select>
                                <p className="mt-3 text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider pl-1 font-display">Status: Locally overridable per node</p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3 pl-1">Operating Region</label>
                                <select 
                                    value={settings.localization.region}
                                    onChange={(e) => setSettings({...settings, localization: {...settings.localization, region: e.target.value}})}
                                    className="w-full bg-gray-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-100 dark:focus:border-indigo-900/30 rounded-xl px-4 py-3.5 font-bold text-gray-700 dark:text-slate-300 focus:ring-4 focus:ring-indigo-100/10 dark:focus:ring-indigo-900/10 outline-none transition-all cursor-pointer appearance-none shadow-inner"
                                >
                                    <option>United Kingdom</option>
                                    <option>United States</option>
                                    <option>European Union</option>
                                    <option>France Metropolitan</option>
                                </select>
                                <p className="mt-3 text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider pl-1 font-display">Determines: Tax Logic & GDPR Tier</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 card-shadow overflow-hidden">
                        <div className="p-8 flex items-center justify-between border-b border-gray-50 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-sm"><Key size={20} /></div>
                                <h3 className="font-bold text-xl font-display text-gray-900 dark:text-slate-100">Security & Authentication</h3>
                            </div>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-gray-400 dark:text-slate-500 shadow-sm">
                                        <Monitor size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900 dark:text-slate-100">Password Synchronizer</p>
                                        <p className="text-xs text-gray-400 dark:text-slate-500">Initiate a secure password reset sequence for your identity.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleReset}
                                    className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-200 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-slate-750 transition-all shadow-sm active:scale-95"
                                >
                                    Force Reset
                                </button>
                            </div>
                            
                            <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-gray-400 dark:text-slate-500 shadow-sm">
                                        <Bell size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900 dark:text-slate-100">Audit Subscriptions</p>
                                        <p className="text-xs text-gray-400 dark:text-slate-500">Receive system-level alerts and abnormal activity reports.</p>
                                    </div>
                                </div>
                                <button className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-200 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-gray-50 dark:hover:bg-slate-750 transition-all shadow-sm">Manage</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 p-8 card-shadow shadow-indigo-100/20 dark:shadow-none">
                        <div className="flex items-center gap-3 mb-10">
                            <h3 className="font-bold font-display text-lg text-gray-900 dark:text-slate-100 uppercase tracking-widest">Global Toggles</h3>
                        </div>
                        <div className="space-y-8">
                            {[
                                { key: 'twoFactorAuth', label: 'Mandatory 2FA', sub: 'Enforce for all administrative nodes' },
                                { key: 'maintenanceMode', label: 'Maintenance Mode', sub: 'Block public endpoint visibility' },
                                { key: 'emailNotifications', label: 'Telemetry Alerts', sub: 'Broadcast system health notifications' },
                            ].map((config) => (
                                <div key={config.key} className="flex items-center justify-between group">
                                    <div className="max-w-[70%]">
                                        <p className="text-xs font-bold text-gray-900 dark:text-slate-200 uppercase tracking-wider mb-0.5">{config.label}</p>
                                        <p className="text-[10px] text-gray-400 dark:text-slate-500 font-medium leading-relaxed">{config.sub}</p>
                                    </div>
                                    <button 
                                        onClick={() => setSettings({...settings, quickConfig: {...settings.quickConfig, [config.key]: !settings.quickConfig[config.key as keyof typeof settings.quickConfig]}})}
                                        className={cn(
                                            "w-11 h-6 rounded-full relative transition-all duration-300 ring-4 ring-transparent group-hover:ring-indigo-100 dark:group-hover:ring-slate-800",
                                            settings.quickConfig[config.key as keyof typeof settings.quickConfig] ? "bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none" : "bg-gray-200 dark:bg-slate-800"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-md",
                                            settings.quickConfig[config.key as keyof typeof settings.quickConfig] ? "right-1" : "left-1"
                                        )}></div>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 space-y-3">
                             <button 
                                onClick={handleSave}
                                disabled={saving}
                                className={cn(
                                    "w-full py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-indigo-100 dark:shadow-none",
                                    saved ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"
                                )}
                             >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle2 size={16} /> : null}
                                {saving ? 'Applying Protocol...' : saved ? 'Logic Synchronized' : 'Commit Configurations'}
                             </button>
                             <button className="w-full py-4 text-gray-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-gray-600 dark:hover:text-slate-300 transition-colors">Abort All Changes</button>
                        </div>
                    </div>

                    <div className="bg-indigo-600 dark:bg-indigo-700 rounded-[2rem] p-8 text-white card-shadow relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="p-3 bg-white/10 rounded-2xl w-fit mb-6 shadow-sm"><Shield size={24} /></div>
                            <h4 className="text-xl font-bold font-display mb-4 leading-tight">Master Administrator Security Shield</h4>
                            <p className="text-[11px] text-indigo-100 leading-relaxed mb-8 opacity-70 font-medium">Session token integrity is verified against Node: EU-CENTRAL-1. Periodic rotation is recommended.</p>
                            <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/30 pb-1 hover:border-white transition-all font-sans">
                                Encryption Standards <ExternalLink size={12} />
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-125 transition-transform duration-1000">
                             <Shield size={140} />
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}
