import { useState } from 'react';
import { Trash2, Eye } from 'lucide-react';
import { cn } from '../../../libs/utils';

type Appointment = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  appointmentDate: string;
  status: 'Completed' | 'Upcoming' | 'Cancelled';
};

const appointments: Appointment[] = [
  {
    id: '1',
    firstName: 'Jane',
    lastName: 'Cooper',
    phoneNumber: '+91 9876543210',
    appointmentDate: '13-Aug-2023 at 10:00 AM',
    status: 'Completed',
  },
  {
    id: '2',
    firstName: 'Wade',
    lastName: 'Warren',
    phoneNumber: '+91 9876543210',
    appointmentDate: '13-Aug-2023 at 10:00 AM',
    status: 'Upcoming',
  },
  {
    id: '3',
    firstName: 'Brooklyn',
    lastName: 'Simmons',
    phoneNumber: '+91 9876543210',
    appointmentDate: '13-Aug-2023 at 10:00 AM',
    status: 'Cancelled',
  },
  {
    id: '4',
    firstName: 'Cameron',
    lastName: 'Williamson',
    phoneNumber: '+91 9876543210',
    appointmentDate: '13-Aug-2023 at 10:00 AM',
    status: 'Completed',
  },
  {
    id: '5',
    firstName: 'Leslie',
    lastName: 'Alexander',
    phoneNumber: '+91 9876543210',
    appointmentDate: '13-Aug-2023 at 10:00 AM',
    status: 'Completed',
  },
  {
    id: '6',
    firstName: 'Savannah',
    lastName: 'Nguyen',
    phoneNumber: '+91 9876543210',
    appointmentDate: '13-Aug-2023 at 10:00 AM',
    status: 'Completed',
  },
  {
    id: '7',
    firstName: 'Darlene',
    lastName: 'Robertson',
    phoneNumber: '+91 9876543210',
    appointmentDate: '13-Aug-2023 at 10:00 AM',
    status: 'Cancelled',
  },
  {
    id: '8',
    firstName: 'Ronald',
    lastName: 'Richards',
    phoneNumber: '+91 9876543210',
    appointmentDate: '13-Aug-2023 at 10:00 AM',
    status: 'Completed',
  },
  {
    id: '9',
    firstName: 'Kathryn',
    lastName: 'Murphy',
    phoneNumber: '+91 9876543210',
    appointmentDate: '13-Aug-2023 at 10:00 AM',
    status: 'Completed',
  },
  {
    id: '10',
    firstName: 'Darrell',
    lastName: 'Steward',
    phoneNumber: '+91 9876543210',
    appointmentDate: '13-Aug-2023 at 10:00 AM',
    status: 'Completed',
  },
];

export function AppointmentTable() {
  const [selectedCategory, setSelectedCategory] =
    useState<string>('Photography');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-600';
      case 'Upcoming':
        return 'bg-amber-100 text-amber-600';
      case 'Cancelled':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('Photography')}
          className={cn(
            'px-4 py-2 rounded-full border',
            selectedCategory === 'Photography'
              ? 'bg-white border-gray-300'
              : 'bg-white border-gray-300',
          )}
        >
          Photography
        </button>
        <button
          onClick={() => setSelectedCategory('Wedding Dress')}
          className={cn(
            'px-4 py-2 rounded-full border',
            selectedCategory === 'Wedding Dress'
              ? 'bg-[#D9B396] text-white border-[#D9B396]'
              : 'bg-white border-gray-300',
          )}
        >
          Wedding Dress
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left">
              <th className="pb-4 font-medium">First Name</th>
              <th className="pb-4 font-medium">Last Name</th>
              <th className="pb-4 font-medium">Phone Number</th>
              <th className="pb-4 font-medium">
                <div className="flex items-center">
                  Appointment Date & Time
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-1"
                  >
                    <path
                      d="M8 3.33334V12.6667"
                      stroke="black"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.6667 8.00001L8.00004 12.6667L3.33337 8.00001"
                      stroke="black"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </th>
              <th className="pb-4 font-medium">Status</th>
              <th className="pb-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr
                key={appointment.id}
                className="border-t border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 px-2">{appointment.firstName}</td>
                <td className="py-4 px-2">{appointment.lastName}</td>
                <td className="py-4 px-2">{appointment.phoneNumber}</td>
                <td className="py-4 px-2">{appointment.appointmentDate}</td>
                <td className="py-4 px-2">
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-sm',
                      getStatusColor(appointment.status),
                    )}
                  >
                    {appointment.status}
                  </span>
                </td>
                <td className="py-4 px-2">
                  <div className="flex gap-2">
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                      <Eye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
