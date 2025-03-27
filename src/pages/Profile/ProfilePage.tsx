import Header from '../../components/header';
import ProfileSidebar from './profile/sidebar';
import ProfileForm from './profile/form';
import Footer from '../../components/footer';
import { JSX } from 'react';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  username: string;
  password: string;
}

// This would typically come from your database or API
const mockUserData: UserData = {
  firstName: 'Anjela',
  lastName: 'Mattuew',
  email: 'Anjela.mw85@gmail.com',
  phone: '246-094-5746',
  dateOfBirth: '30/11/1980',
  username: 'Anjella80',
  password: '********',
};

export default function ProfilePage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ProfileSidebar
              activeTab="profile"
              userName={`${mockUserData.firstName} ${mockUserData.lastName}`}
              userImage="/placeholder.svg?height=100&width=100"
            />
          </div>

          <div className="md:col-span-2 bg-white rounded-lg border p-6">
            <ProfileForm initialData={mockUserData} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
