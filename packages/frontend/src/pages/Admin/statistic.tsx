import { OrdersChart } from './components/orders-chart';
import { ProfitsChart } from './components/profits-chart';
import { SalesEfficiencyChart } from './components/sales-efficiency-chart';
import { SearchBar } from './components/search-bar';
import { Sidebar } from './components/sidebar';
import { TopProductsChart } from './components/top-products-chart';

export default function StatisticsPage() {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Statistics</h1>
          <SearchBar />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <TopProductsChart />
          <ProfitsChart />
          <SalesEfficiencyChart />
          <OrdersChart />
        </div>
      </main>
    </div>
  );
}
