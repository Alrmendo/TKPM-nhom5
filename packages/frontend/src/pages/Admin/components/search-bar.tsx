import { Search } from 'lucide-react';

export function SearchBar() {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search"
        className="w-[300px] py-2 px-4 pr-10 rounded-full bg-[#F2E4D4] text-gray-700 placeholder-gray-500 focus:outline-none"
      />
      <Search
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        size={18}
      />
    </div>
  );
}
