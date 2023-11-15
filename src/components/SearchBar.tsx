import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

type FunctionType<T extends any[]> = (...args: T) => void;

const debounce = <T extends any[]>(func: FunctionType<T>, delay: number): FunctionType<T> => {
  let debounceTimer: NodeJS.Timeout | null = null;
  return function (...args: T) {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func(...args), delay);
  };
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [inputValue, setInputValue] = useState("");

  const debouncedSearch = useCallback(
    debounce<string[]>((query) => onSearch(query), 500),
    [onSearch],
  );

  useEffect(() => {
    debouncedSearch(inputValue);
  }, [inputValue, debouncedSearch]);

  return (
    <div className="flex gap-2 items-center mt-12 mb-12 w-full justify-center">
      <Input
        type="text"
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Recherchez des articles de loi par mot clé"
        className="w-1/2"
      />
    </div>
  );
}
