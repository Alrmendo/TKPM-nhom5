import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, LogOut, User, ClipboardList, Package, Truck, MapPin, Settings, HelpCircle } from 'lucide-react';
import { LogoutModal } from './logout-modal';

interface ProfileSidebarProps {
  activeTab: string;
  userName: string;
  userImage?: string;
}

export default function ProfileSidebar({ activeTab, userName, userImage }: ProfileSidebarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: <User className="h-5 w-5" /> },
    { id: 'order-history', label: 'Order History', icon: <ClipboardList className="h-5 w-5" /> },
    { id: 'current-orders', label: 'Current orders', icon: <Package className="h-5 w-5" /> },
    { id: 'track-order', label: 'Track Order', icon: <Truck className="h-5 w-5" /> },
    { id: 'address', label: 'My Address', icon: <MapPin className="h-5 w-5" /> },
    { id: 'settings', label: 'Setting', icon: <Settings className="h-5 w-5" /> },
    { id: 'help', label: 'Help', icon: <HelpCircle className="h-5 w-5" /> },
  ];

  const handleLogout = () => {
    // Xử lý logout ở đây, ví dụ như xoá cookie, localStorage, v.v.
    console.log('User logged out');
    navigate('/');
  };

  return (
    <div className="bg-white rounded-lg border p-6 flex flex-col h-full">
      <div className="relative mb-4 flex flex-col items-center">
        <div className="relative">
          <img
            src={userImage || '/placeholder.svg?height=100&width=100'}
            alt={userName}
            width={100}
            height={100}
            className="rounded-full object-cover"
          />
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-0 right-0 bg-white rounded-full p-1 border shadow-sm"
            aria-label="Edit profile picture"
          >
            <Pencil className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        <h2 className="mt-3 font-medium text-lg">{userName}</h2>
        <div className="w-full border-t my-4"></div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map(item => (
            <li key={item.id}>
              <Link
                to={`/${item.id}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                  activeTab === item.id ? 'bg-rose-50 text-rose-500 font-medium' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t">
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Log Out</span>
        </button>
      </div>

      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onLogout={handleLogout} />
    </div>
  );
}
