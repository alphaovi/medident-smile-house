import { Link } from 'react-router';
import { User, Users, Shield, Bell, Settings as SettingsIcon, CreditCard, Lock, HelpCircle } from 'lucide-react';

const settingsData = [
    {
        title: 'Profile Settings',
        path: '/settings/profile',
        icon: <User className="w-6 h-6 text-white" />,
        gradient: 'from-purple-600 via-indigo-600 to-blue-600',
        shadow: 'shadow-purple-500/20',
    },
    {
        title: 'Manage Suppliers',
        path: '/settings/manage-suppliers',
        icon: <Users className="w-6 h-6 text-white" />,
        gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
        shadow: 'shadow-cyan-500/20',
    },
    {
        title: 'Security & Privacy',
        path: '/settings/security',
        icon: <Shield className="w-6 h-6 text-white" />,
        gradient: 'from-pink-500 via-rose-500 to-orange-500',
        shadow: 'shadow-rose-500/20',
    },
    {
        title: 'Notifications',
        path: '/settings/notifications',
        icon: <Bell className="w-6 h-6 text-white" />,
        gradient: 'from-amber-500 via-orange-500 to-red-500',
        shadow: 'shadow-amber-500/20',
    },
    {
        title: 'Billing & Plans',
        path: '/settings/billing',
        icon: <CreditCard className="w-6 h-6 text-white" />,
        gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
        shadow: 'shadow-emerald-500/20',
    },
    {
        title: 'App Preferences',
        path: '/settings/preferences',
        icon: <SettingsIcon className="w-6 h-6 text-white" />,
        gradient: 'from-violet-600 via-fuchsia-600 to-pink-600',
        shadow: 'shadow-fuchsia-500/20',
    },
];

const Settings = () => {
    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">Settings</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account and app preferences</p>
            </div>

            {/* Responsive Cards Grid Container: Mobile e 1 ta, Tablet e 2 ta, PC/Desktop e 3 ta card pasapashi dekhabe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {settingsData.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r ${item.gradient} ${item.shadow} shadow-lg transform transition-all duration-300 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98] group`}
                    >
                        {/* Background decorative absolute shapes for modern glossy card effect */}
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/25 transition-all duration-500"></div>
                        
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl border border-white/20 shadow-inner">
                                    {item.icon}
                                </div>
                                <span className="text-lg font-semibold text-white tracking-wide">
                                    {item.title}
                                </span>
                            </div>

                            {/* Arrow icon for navigation feel */}
                            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/80 group-hover:bg-white/25 group-hover:text-white transition-all">
                                <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Settings;