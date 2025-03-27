import { JSX, useState } from 'react';
import { Pencil, LogOut, User, ClipboardList, Package, Truck, MapPin, Settings, HelpCircle } from 'lucide-react';

interface ProfileSidebarProps {
  activeTab: string;
  userName: string;
  userImage?: string;
}

export default function ProfileSidebar({ activeTab, userName, userImage }: ProfileSidebarProps): JSX.Element {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const menuItems: { id: string; label: string; icon: JSX.Element }[] = [
    { id: 'profile', label: 'My Profile', icon: <User className="h-5 w-5" /> },
    { id: 'order-history', label: 'Order History', icon: <ClipboardList className="h-5 w-5" /> },
    { id: 'current-orders', label: 'Current Orders', icon: <Package className="h-5 w-5" /> },
    { id: 'track-order', label: 'Track Order', icon: <Truck className="h-5 w-5" /> },
    { id: 'address', label: 'My Address', icon: <MapPin className="h-5 w-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
    { id: 'help', label: 'Help', icon: <HelpCircle className="h-5 w-5" /> },
  ];

  return (
    <div className="bg-white rounded-lg border p-6 flex flex-col h-full">
      <div className="relative mb-4 flex flex-col items-center">
        <div className="relative">
          <img
            src={userImage || '/placeholder.svg'}
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
          {menuItems.map(({ id, label, icon }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                  activeTab === id ? 'bg-rose-50 text-rose-500 font-medium' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {icon}
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t">
        <button className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors">
          <LogOut className="h-5 w-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
