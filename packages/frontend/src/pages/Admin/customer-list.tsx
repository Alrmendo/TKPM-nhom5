import { Sidebar } from './components/sidebar';
import { SearchBar } from './components/search-bar';
import { CustomerStatsCard } from './components/customer-stats-card';
import { CustomerTable } from './components/customer-table';
import { Users } from 'lucide-react';

export default function CustomerListPage() {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Customer List</h1>
          <SearchBar />
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <CustomerStatsCard
            title="Total Customers"
            value="10,678"
            icon={<Users className="text-[#D9B396]" size={20} />}
            color="bg-[#D9B396]"
          />
          <CustomerStatsCard
            title="New Customers"
            value="1,000"
            icon={<Users className="text-[#3B82F6]" size={20} />}
            color="bg-[#3B82F6]"
          />
          <CustomerStatsCard
            title="Total Members"
            value="8,846"
            icon={<Users className="text-[#65A30D]" size={20} />}
            color="bg-[#65A30D]"
          />
          <CustomerStatsCard
            title="Non-Members"
            value="832"
            icon={<Users className="text-[#EF4444]" size={20} />}
            color="bg-[#EF4444]"
          />
        </div>

        <CustomerTable />
      </main>
    </div>
  );
}
