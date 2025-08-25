// src/hooks/useFilter.js
import { useMemo } from "react";

export function useFilter(data, filters) {
  return useMemo(() => {
    return data.filter(item => {
      let match = true;
      if (filters.status && item.status !== filters.status) match = false;
      if (filters.name && !item.name.toLowerCase().includes(filters.name.toLowerCase())) match = false;
      if (filters.fromDate && new Date(item.borrowedDate) < new Date(filters.fromDate)) match = false;
      if (filters.toDate && new Date(item.borrowedDate) > new Date(filters.toDate)) match = false;
      return match;
    });
  }, [data, filters]);
}