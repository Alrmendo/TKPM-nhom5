import { SearchBar } from './components/search-bar';
import { Sidebar } from './components/sidebar';
import { AppointmentTable } from './components/appointment-table';

export default function AppointmentsPage() {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Manage Appointments</h1>
          <SearchBar />
        </div>
        <AppointmentTable />
      </main>
    </div>
  );
}
