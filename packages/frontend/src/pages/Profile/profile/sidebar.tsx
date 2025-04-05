import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Pencil,
  LogOut,
  User,
  ClipboardList,
  Package,
  Truck,
  MapPin,
  Settings,
  HelpCircle,
  Upload,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { LogoutModal } from './logout-modal';
import { uploadProfileImage } from '../../../api/user';

interface ProfileSidebarProps {
  activeTab: string;
  userName: string;
  userImage?: string;
  onImageUpdate?: (imageUrl: string) => void;
}

export default function ProfileSidebar({
  activeTab,
  userName,
  userImage,
  onImageUpdate,
}: ProfileSidebarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate();
  const { clearCookie } = useAuth();

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: <User className="h-5 w-5" /> },
    {
      id: 'order-history',
      label: 'Order History',
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      id: 'current-orders',
      label: 'Current orders',
      icon: <Package className="h-5 w-5" />,
    },
    {
      id: 'track-order',
      label: 'Track Order',
      icon: <Truck className="h-5 w-5" />,
    },
    {
      id: 'address',
      label: 'My Address',
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      id: 'settings',
      label: 'Setting',
      icon: <Settings className="h-5 w-5" />,
    },
    { id: 'help', label: 'Help', icon: <HelpCircle className="h-5 w-5" /> },
  ];

  const handleLogout = () => {
    clearCookie();
    navigate('/signin');
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please select a valid image file (JPEG, PNG, GIF)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image size should be less than 2MB');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await uploadProfileImage(formData);
      
      if (onImageUpdate) {
        onImageUpdate(response.imageUrl);
      }
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6 flex flex-col h-full">
      <div className="relative mb-4 flex flex-col items-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200">
            {userImage ? (
              <img
                src={userImage}
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <User className="h-12 w-12 text-gray-400" />
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
          </div>
          
          <button
            onClick={handleUploadClick}
            className="absolute bottom-0 right-0 bg-rose-500 text-white p-1 rounded-full hover:bg-rose-600 transition-colors"
            aria-label="Edit profile picture"
          >
            <Upload className="h-4 w-4" />
          </button>
          
          <input 
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileChange}
          />
        </div>
        
        {uploadError && (
          <div className="mt-2 text-red-600 text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>{uploadError}</span>
          </div>
        )}
        
        <h2 className="mt-3 font-medium text-lg">{userName}</h2>
        <div className="w-full border-t my-4"></div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link
                to={`/${item.id}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                  activeTab === item.id
                    ? 'bg-rose-50 text-rose-500 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
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

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
}
