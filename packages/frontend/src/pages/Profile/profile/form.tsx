import React, { JSX, useState } from 'react';
import { Button } from '../../../components/button';
import { Input } from '../../../components/input';
import { Label } from '../../../components/label';

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
}

export default function ProfileForm({ initialData }: ProfileFormProps): JSX.Element {
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Saving profile data:', formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-medium">Hello {formData.firstName}!</h1>
        <p className="text-gray-500 mt-1">You can find all information about your profile</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-rose-500 font-medium">Edit Your Profile</h2>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'First name', name: 'firstName', type: 'text' },
              { label: 'Last name', name: 'lastName', type: 'text' },
              { label: 'E-mail', name: 'email', type: 'email' },
              { label: 'Phone number', name: 'phone', type: 'text' },
              { label: 'Date of birth', name: 'dateOfBirth', type: 'text' },
            ].map(({ label, name, type }) => (
              <div key={name} className="space-y-2">
                <Label htmlFor={name}>{label}</Label>
                <Input
                  id={name}
                  name={name}
                  type={type}
                  value={formData[name as keyof ProfileData]}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            ))}
          </div>

          <div className="pt-6 border-t">
            <h2 className="text-rose-500 font-medium mb-4">Your Username and Password</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Username', name: 'username', type: 'text' },
                { label: 'Password', name: 'password', type: 'password' },
              ].map(({ label, name, type }) => (
                <div key={name} className="space-y-2">
                  <Label htmlFor={name}>{label}</Label>
                  <Input
                    id={name}
                    name={name}
                    type={type}
                    value={formData[name as keyof ProfileData]}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              ))}
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <Button type="submit" className="bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600">
                Save changes
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
