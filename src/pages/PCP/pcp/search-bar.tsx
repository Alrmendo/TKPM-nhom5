import type React from 'react';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ placeholder = 'Search...', onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center border-b border-gray-300 pb-2">
          <Search className="h-5 w-5 text-gray-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full outline-none bg-transparent text-gray-700"
            aria-label="Search"
          />
        </div>
      </form>
    </div>
  );
}
