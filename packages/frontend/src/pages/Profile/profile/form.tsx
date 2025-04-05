import React, { useState } from 'react';
import { Button } from '../../../components/button';
import { Input } from '../../../components/input';
import { Label } from '../../../components/label';
import { updateProfile, updatePassword, updateUsername, UpdateProfileData } from '../../../api/user';
import { useAuth } from '../../../context/AuthContext';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  username: string;
  password: string;
}

interface ProfileFormProps {
  initialData: ProfileData;
  onProfileUpdate?: (updatedData: UpdateProfileData) => void;
}

export default function ProfileForm({ initialData, onProfileUpdate }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { getRoleFromCookie } = useAuth();
  
  // For password change
  const [showPasswordChange, setShowPasswordChange] = useState<boolean>(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // For username change
  const [showUsernameChange, setShowUsernameChange] = useState<boolean>(false);
  const [usernameData, setUsernameData] = useState({
    newUsername: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setUsernameData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const updatedData: UpdateProfileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
      };
      
      const response = await updateProfile(updatedData);
      setSuccess('Profile updated successfully');
      
      if (onProfileUpdate) {
        onProfileUpdate(updatedData);
      }
      
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await updatePassword(passwordData);
      setSuccess('Password updated successfully');
      setShowPasswordChange(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await updateUsername(usernameData);
      
      // Refresh the token to update the username in the JWT
      await getRoleFromCookie();
      
      setSuccess('Username updated successfully');
      setShowUsernameChange(false);
      
      // Update the form data with the new username
      setFormData(prev => ({ ...prev, username: response.username }));
      
      if (onProfileUpdate) {
        onProfileUpdate({ username: response.username });
      }
      
      setUsernameData({
        newUsername: '',
        password: '',
      });
      
      // Refresh the page to ensure everything is updated
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Failed to update username');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-medium">Hello {formData.firstName || formData.username}!</h1>
        <p className="text-gray-500 mt-1">You can find all information about your profile</p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-rose-500 font-medium">Edit Your Profile</h2>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'First name', name: 'firstName', type: 'text' },
              { label: 'Last name', name: 'lastName', type: 'text' },
              { label: 'E-mail', name: 'email', type: 'email', disabled: true },
              { label: 'Phone number', name: 'phone', type: 'text' },
              { label: 'Date of birth', name: 'dateOfBirth', type: 'text' },
            ].map(({ label, name, type, disabled }) => (
              <div key={name} className="space-y-2">
                <Label htmlFor={name}>{label}</Label>
                <Input
                  id={name}
                  name={name}
                  type={type}
                  value={formData[name as keyof ProfileData]}
                  onChange={handleChange}
                  disabled={!isEditing || disabled}
                />
              </div>
            ))}
          </div>

          <div className="pt-6 border-t">
            <h2 className="text-rose-500 font-medium mb-4">Your Username and Password</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="flex space-x-2">
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    disabled={true}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowUsernameChange(true)}
                  >
                    Change
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex space-x-2">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    disabled={true}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowPasswordChange(true)}
                  >
                    Change
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          )}
        </form>
        
        {showPasswordChange && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-medium mb-4">Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowPasswordChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Password'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {showUsernameChange && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-medium mb-4">Change Username</h2>
              <form onSubmit={handleUsernameSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newUsername">New Username</Label>
                  <Input
                    id="newUsername"
                    name="newUsername"
                    type="text"
                    value={usernameData.newUsername}
                    onChange={handleUsernameChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Confirm with Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={usernameData.password}
                    onChange={handleUsernameChange}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowUsernameChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Username'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
