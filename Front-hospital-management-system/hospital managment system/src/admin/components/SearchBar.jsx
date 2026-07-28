import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IconSearch, IconX } from '@tabler/icons-react';

export default function SearchBar({ placeholder = 'Search...', onSearch }) {
  const [value, setValue] = useState('');
  const timerRef = useRef(null);

  const debouncedSearch = useCallback(
    (val) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onSearch(val.trim());
      }, 400);
    },
    [onSearch]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = (e) => {
    const v = e.target.value;
    setValue(v);
    debouncedSearch(v);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <div className="admin-search">
      <IconSearch size={16} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      {value && (
        <button
          className="admin-search-clear"
          onClick={handleClear}
          type="button"
          aria-label="Clear search"
        >
          <IconX size={14} />
        </button>
      )}
    </div>
  );
}
