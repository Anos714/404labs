"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type PageSearch = {
  query: string;
  setQuery: (value: string) => void;
};

const SearchContext = createContext<PageSearch>({
  query: "",
  setQuery: () => {},
});

export function PageSearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export function usePageSearch() {
  return useContext(SearchContext);
}
