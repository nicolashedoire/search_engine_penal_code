import React, { useState, useCallback, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFocusChange?: (focused: boolean) => void;
  searchTerm?: string;
  placeholder?: string;
  className?: string;
}

type FunctionType<T extends any[]> = (...args: T) => void;

const debounce = <T extends any[]>(
  func: FunctionType<T>,
  delay: number,
): FunctionType<T> => {
  let debounceTimer: NodeJS.Timeout | null = null;
  return function (...args: T) {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func(...args), delay);
  };
};

export default function SearchBar({ 
  onSearch, 
  onFocusChange,
  searchTerm = "",
  placeholder = "Recherchez des articles de loi par mot clé",
  className = ""
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(searchTerm);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Synchroniser l'état interne avec le searchTerm externe
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce<string[]>((query) => onSearch(query), 500),
    [onSearch],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocusChange?.(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onFocusChange?.(false);
  };

  const handleClear = () => {
    setInputValue("");
    onSearch("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      <div className={`
        relative flex items-center
        transition-all duration-200 ease-in-out
        ${isFocused 
          ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-lg' 
          : 'shadow-sm hover:shadow-md'
        }
        bg-white border border-gray-200 rounded-xl
        group
      `}>
        {/* Icône de recherche */}
        <div className="flex items-center justify-center w-12 h-12 text-gray-400 group-hover:text-gray-600 transition-colors">
          <Search className="w-5 h-5" />
        </div>

        {/* Input de recherche */}
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="
            flex-1 border-0 bg-transparent px-0 py-3
            text-gray-900 placeholder-gray-500
            focus:outline-none focus:ring-0 focus:border-0
            focus-visible:ring-0 focus-visible:ring-offset-0
            text-base shadow-none
          "
          autoComplete="off"
          spellCheck="false"
        />

        {/* Bouton de suppression */}
        {inputValue && (
          <button
            onClick={handleClear}
            className="
              flex items-center justify-center w-12 h-12 mr-1
              text-gray-400 hover:text-gray-600 hover:bg-gray-50
              rounded-lg transition-all duration-150
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
            "
            aria-label="Effacer la recherche"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Indicateur de saisie */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          <div className="flex items-center gap-2">
            <span>💡</span>
            <span>Tapez pour rechercher dans les articles de loi</span>
          </div>
        </div>
      )}
    </div>
  );
}