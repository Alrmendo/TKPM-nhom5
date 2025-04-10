import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'Online' | 'Offline';
  avatar: string;
}

const customers: Customer[] = [
  {
    id: '1',
    name: 'Jacob Swanson',
    email: 'jacobswanson@email.com',
    phone: '555-123-4567',
    address: 'Phoenix, USA',
    status: 'Online',
    avatar: '/placeholder.svg',
  },
  {
    id: '2',
    name: 'Amelia Johnson',
    email: 'ameliajohnson@email.com',
    phone: '555-987-6543',
    address: 'Philadelphia, USA',
    status: 'Offline',
    avatar: '/placeholder.svg',
  },
  {
    id: '3',
    name: 'Eric Slater',
    email: 'ericslater@email.com',
    phone: '555-555-7890',
    address: 'Dallas, USA',
    status: 'Offline',
    avatar: '/placeholder.svg',
  },
  {
    id: '4',
    name: 'Aaron Chadwick',
    email: 'aaronchadwick@email.com',
    phone: '555-321-6540',
    address: 'San Diego, USA',
    status: 'Online',
    avatar: '/placeholder.svg',
  },
  {
    id: '5',
    name: 'Jessica Sloan',
    email: 'jessicasloan@email.com',
    phone: '555-888-9999',
    address: 'Detroit, USA',
    status: 'Online',
    avatar: '/placeholder.svg',
  },
  {
    id: '6',
    name: 'Mary Grover',
    email: 'marygrover@email.com',
    phone: '555-444-2222',
    address: 'Portland, USA',
    status: 'Online',
    avatar: '/placeholder.svg',
  },
  {
    id: '7',
    name: 'Matt Robbins',
    email: 'mattrobbins@email.com',
    phone: '555-666-7777',
    address: 'Charlotte, USA',
    status: 'Online',
    avatar: '/placeholder.svg',
  },
  {
    id: '8',
    name: 'Dehlia Drake',
    email: 'dehliadrake@email.com',
    phone: '555-777-8888',
    address: 'Las Vegas, USA',
    status: 'Offline',
    avatar: '/placeholder.svg',
  },
  {
    id: '9',
    name: 'Conrad Webber',
    email: 'conradwebber@email.com',
    phone: '555-234-5678',
    address: 'Nashville, USA',
    status: 'Offline',
    avatar: '/placeholder.svg',
  },
  {
    id: '10',
    name: 'Zeke Romez',
    email: 'zekeromez@email.com',
    phone: '555-876-5432',
    address: 'Indianapolis, USA',
    status: 'Online',
    avatar: '/placeholder.svg',
  },
];

export const CustomerTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const totalCustomers = 10678;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCustomers / itemsPerPage);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map((c) => c.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectCustomer = (id: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id],
    );
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="p-4 text-left font-medium">Customer Name</th>
              <th className="p-4 text-left font-medium">Email</th>
              <th className="p-4 text-left font-medium">Phone</th>
              <th className="p-4 text-left font-medium">Address</th>
              <th className="p-4 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.includes(customer.id)}
                    onChange={() => handleSelectCustomer(customer.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                    <span>{customer.name}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-600">{customer.email}</td>
                <td className="p-4 text-gray-600">{customer.phone}</td>
                <td className="p-4 text-gray-600">{customer.address}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      customer.status === 'Online'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {customer.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 flex items-center justify-between border-t">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{itemsPerPage}</span> of{' '}
          <span className="font-medium">{totalCustomers}</span> entries
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md border hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-8 h-8 rounded-md ${
                currentPage === page
                  ? 'bg-[#D9B396] text-white'
                  : 'hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
