"use client";
import { SearchBarProps } from "@/lib/types";
import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  placeholder,
}: SearchBarProps) => {
  return (
    <div className="relative w-[300px] max-w-md">
      <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-12 pr-4 py-2 w-full rounded-lg bg-muted focus:ring-2 duration-150 focus:ring-primary"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
