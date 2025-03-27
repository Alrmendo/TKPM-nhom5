import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import type { AddressData } from './address-card';

interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (address: Omit<AddressData, 'id' | 'mapImage'>) => void;
  initialData?: Omit<AddressData, 'id' | 'mapImage'>;
  title?: string;
}

export const AddressFormDialog: React.FC<AddressFormDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  initialData,
  title = 'Add New Address',
}) => {
  const [formData, setFormData] = useState<Omit<AddressData, 'id' | 'mapImage'>>(
    initialData || {
      street: '',
      city: '',
      province: '',
      country: '',
      postalCode: '',
      mobile: '',
      receiver: '',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="street">Street Address</Label>
              <Input id="street" name="street" value={formData.street} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="province">Province/State</Label>
                <Input id="province" name="province" value={formData.province} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" value={formData.country} onChange={handleChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="receiver">Receiver Name</Label>
              <Input id="receiver" name="receiver" value={formData.receiver} onChange={handleChange} required />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="bg-[#c3937c] hover:bg-[#b38069] text-white">
              Save Address
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
