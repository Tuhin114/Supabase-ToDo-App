// components/layout/page/TaskSearch.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface TaskSearchProps {
  onSearch: (query: string) => void;
}

export function TaskSearch({ onSearch }: TaskSearchProps) {
  const [query, setQuery] = useState("");

  // Whenever `query` changes, notify parent immediately
  useEffect(() => {
    onSearch(query.trim());
  }, [query, onSearch]);

  return (
    <Input
      type="text"
      placeholder="Search tasks..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="text-sm"
    />
  );
}
