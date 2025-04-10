import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText,
  ListOrdered,
  Calendar,
  Users,
  BarChart2,
  Settings,
  LogOut,
  CalendarIcon,
} from 'lucide-react';
import { cn } from '../../../libs/utils';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    { icon: FileText, label: 'Order', href: '/order' },
    { icon: ListOrdered, label: 'Current orders', href: '/current-orders' },
    { icon: Calendar, label: 'Calendar', href: '/calendar' },
    { icon: CalendarIcon, label: 'Appointments', href: '/appointments' },
    { icon: Users, label: 'Customer list', href: '/customer-list' },
    { icon: BarChart2, label: 'Statistics', href: '/statistics' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className="w-[220px] h-screen bg-[#FFFBF2] flex flex-col">
      <div className="flex flex-col items-center pt-10 pb-6">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
          <img
            src="/placeholder.svg"
            alt="Profile"
            width={80}
            height={80}
            className="object-cover w-20 h-20"
          />
        </div>
        <h2 className="font-medium text-lg">Anjela Mattuew</h2>
      </div>

      <div className="border-t border-gray-200 my-2" />

      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors',
                  pathname === item.href && 'text-[#D9B396]',
                  pathname.includes('statistics') &&
                    item.href === '/statistics' &&
                    'text-[#D9B396]',
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-4 pb-8">
        <button className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-gray-100 rounded-md w-full transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};
