import { useState } from 'react';

export function useCollapsedSections() {
  const [favsCollapsed, setFavsCollapsed] =
    useState(false);

  const [recentCollapsed, setRecentCollapsed] =
    useState(false);

  const [trendingCollapsed, setTrendingCollapsed] =
    useState(false);

  return {
    favsCollapsed,
    setFavsCollapsed,

    recentCollapsed,
    setRecentCollapsed,

    trendingCollapsed,
    setTrendingCollapsed,
  };
}