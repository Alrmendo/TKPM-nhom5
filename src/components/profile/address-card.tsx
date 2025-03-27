import React from 'react';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

export interface AddressData {
  id: string;
  street: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  mobile: string;
  receiver: string;
  mapImage: string;
}

interface AddressCardProps {
  address: AddressData;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSetDefault?: (id: string) => void;
  isDefault?: boolean;
}

export const AddressCard: React.FC<AddressCardProps> = ({ address, onEdit, onDelete, onSetDefault, isDefault }) => {
  return (
    <div className="border-b py-4 first:pt-0 last:border-0">
      <div className="flex justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Address:</span> {address.street}, {address.city}, {address.country}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Postal code:</span> {address.postalCode}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Mobile:</span> {address.mobile}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Receiver:</span> {address.receiver}
              </p>
            </div>

            <div className="relative w-24 h-24 rounded-md overflow-hidden">
              <img
                src={address.mapImage || '/placeholder.svg'}
                alt={`Map for ${address.street}`}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <MoreVertical className="h-5 w-5 text-gray-500" />
                <span className="sr-only">More options</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(address.id)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(address.id)}>Delete</DropdownMenuItem>
              {onSetDefault && !isDefault && (
                <DropdownMenuItem onClick={() => onSetDefault(address.id)}>Set as default</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
