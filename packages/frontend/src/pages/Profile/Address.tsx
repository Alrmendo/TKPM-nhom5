import { useState, useCallback, useEffect } from 'react';
import Header from '../../components/header';
import ProfileSidebar from './profile/sidebar';
import Footer from '../../components/footer';
import { Button } from '../../components/button';
import { PlusCircle } from 'lucide-react';
import { AddressCard, type AddressData } from './profile/address-card';
import { AddressFormDialog } from './profile/address-form-dialog';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile } from '../../api/user';
import { UserProfile } from '../../api/user';

const initialAddresses: AddressData[] = [
  {
    id: '1',
    street: '6 Parisian Crescent',
    city: 'Ontario',
    province: 'ON',
    country: 'Canada',
    postalCode: 'L4N0Y9',
    mobile: '249-9897446',
    receiver: 'Anjela Mattuew',
    mapImage: '/placeholder.svg',
  },
  {
    id: '2',
    street: '95 Barre Dr, Barrie',
    city: 'Ontario',
    province: 'ON',
    country: 'Canada',
    postalCode: 'M0Y7Y5',
    mobile: '249-9897446',
    receiver: 'Anjela Mattuew',
    mapImage: '/placeholder.svg',
  },
];

export default function AddressPage() {
  const [addresses, setAddresses] = useState<AddressData[]>(initialAddresses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressData | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserProfile();
        setUserData(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  const handleAddAddress = useCallback(
    (newAddress: Omit<AddressData, 'id' | 'mapImage'>) => {
      const newId = Math.random().toString(36).substring(2, 9);
      const newAddressData: AddressData = {
        ...newAddress,
        id: newId,
        mapImage: '/placeholder.svg',
      };

      setAddresses(prev => [...prev, newAddressData]);
      toast({ title: 'Address added', description: 'Your new address has been added successfully.' });
    },
    [toast]
  );

  const handleEditAddress = useCallback(
    (id: string) => {
      const addressToEdit = addresses.find(addr => addr.id === id);
      if (addressToEdit) setEditingAddress(addressToEdit);
    },
    [addresses]
  );

  const handleSaveEdit = useCallback(
    (updatedAddress: Omit<AddressData, 'id' | 'mapImage'>) => {
      if (!editingAddress) return;

      setAddresses(prev => prev.map(addr => (addr.id === editingAddress.id ? { ...addr, ...updatedAddress } : addr)));
      setEditingAddress(null);
      toast({ title: 'Address updated', description: 'Your address has been updated successfully.' });
    },
    [editingAddress, toast]
  );

  const handleDeleteAddress = useCallback(
    (id: string) => {
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      toast({ title: 'Address deleted', description: 'Your address has been deleted successfully.' });
    },
    [toast]
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ProfileSidebar
              activeTab="address"
              userName={userData ? userData.username : 'User'}
              userImage={userData?.profileImageUrl}
              fullName={userData ? `${userData.firstName} ${userData.lastName}` : undefined}
            />
          </div>

          <div className="md:col-span-2 bg-white rounded-lg border p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-medium">My Address</h1>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                variant="outline"
                className="text-[#c3937c] border-[#c3937c] hover:bg-[#c3937c] hover:text-white"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add new address
              </Button>
            </div>

            <div className="divide-y">
              {addresses.map(address => (
                <AddressCard
                  key={address.id}
                  address={address}
                  onEdit={handleEditAddress}
                  onDelete={handleDeleteAddress}
                />
              ))}

              {addresses.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-gray-500">You don't have any saved addresses yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <AddressFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddAddress}
        title="Add New Address"
      />

      {editingAddress && (
        <AddressFormDialog
          open={!!editingAddress}
          onOpenChange={open => !open && setEditingAddress(null)}
          onSave={handleSaveEdit}
          initialData={{
            street: editingAddress.street,
            city: editingAddress.city,
            province: editingAddress.province,
            country: editingAddress.country,
            postalCode: editingAddress.postalCode,
            mobile: editingAddress.mobile,
            receiver: editingAddress.receiver,
          }}
          title="Edit Address"
        />
      )}

      <Footer />
    </div>
  );
}
