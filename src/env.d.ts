/// <reference types="astro/client" />

interface ExplorerFilters {
  trails: boolean;
  smoke: boolean;
  statuses: string[];
}

interface ExplorerApi {
  applyFilters: (filters: ExplorerFilters) => void;
  focus: (id: string, reduceMotion: boolean) => void;
}

interface Window {
  __mzExplorer?: ExplorerApi;
}
