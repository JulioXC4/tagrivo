import { printers, type Printer, type Connection, type OperatingSystem } from '../data/printers.ts';
import { supportsRoute, supportsFormat, useCase, type LabelFormat } from '../data/workflows.ts';
export interface CatalogFilters {
  query: string;
  connection: Connection;
  os: OperatingSystem | '';
  dpi: string;
  format: LabelFormat | '';
  use: string;
  sort: string;
}
export function filterCatalog(filters: CatalogFilters, catalog: Printer[] = printers): Printer[] {
  return catalog
    .filter((p) => {
      const query = filters.query
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
      if (
        !`${p.brand}${p.name}${p.model}`
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .includes(query)
      )
        return false;
      if (
        filters.os
          ? !supportsRoute(p, filters.os, filters.connection)
          : filters.connection !== 'any' && !p.connections.includes(filters.connection)
      )
        return false;
      return (
        (!filters.dpi || p.dpi === Number(filters.dpi)) &&
        (!filters.format || supportsFormat(p, filters.format)) &&
        (!filters.use || useCase(p) === filters.use)
      );
    })
    .sort((a, b) =>
      filters.sort === 'resolution'
        ? b.dpi - a.dpi || a.name.localeCompare(b.name)
        : filters.sort === 'speed'
          ? b.speed - a.speed || a.name.localeCompare(b.name)
          : filters.sort === 'name'
            ? a.name.localeCompare(b.name)
            : 0,
    );
}
export function toggleComparison(ids: string[], id: string): string[] {
  if (!printers.some((p) => p.id === id)) return ids;
  return ids.includes(id) ? ids.filter((x) => x !== id) : ids.length < 3 ? [...ids, id] : ids;
}
