import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/dialog';
import { Button } from '../../../components/button';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function LogoutModal({ isOpen, onClose, onLogout }: LogoutModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <DialogTitle className="text-xl font-medium mt-4">Are you sure log out to your account?</DialogTitle>
        </DialogHeader>

        <DialogFooter className="flex-col sm:flex-col gap-2 sm:gap-2 mt-4">
          <div className="flex justify-center gap-4 w-full">
            <Button onClick={onLogout} className="bg-red-600 hover:bg-red-700 text-white w-32">
              Log out
            </Button>
            <Button onClick={onClose} variant="outline" className="border-gray-300 text-gray-700 w-32">
              Stay log in
            </Button>
          </div>

          <DialogDescription className="text-center pt-4">
            <p className="text-gray-800 font-medium">Thank you for using Enchanted</p>
            <p className="text-gray-600 mt-1">Hope to see you soon</p>
          </DialogDescription>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
