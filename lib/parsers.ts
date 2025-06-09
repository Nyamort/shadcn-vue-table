import { z } from "zod";

import { dataTableConfig } from "@/config/data-table";

import type {
  ExtendedColumnFilter,
  ExtendedColumnSort,
} from "@/types/data-table";

const sortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
});

export const getSortingStateParser = <TData>(
  columnIds?: string[] | Set<string>,
) => {
  const validKeys = columnIds
    ? columnIds instanceof Set
      ? columnIds
      : new Set(columnIds)
    : null;

  return {
    parse: (value: string) => {
      try {
        const parsed = JSON.parse(value);
        const result = z.array(sortingItemSchema).safeParse(parsed);

        if (!result.success) return [];

        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return [];
        }

        return result.data as ExtendedColumnSort<TData>[];
      } catch {
        return [];
      }
    },
    serialize: (value: ExtendedColumnSort<TData>[]) => JSON.stringify(value),
  };
};

const filterItemSchema = z.object({
  id: z.string(),
  value: z.union([z.string(), z.array(z.string())]),
  variant: z.enum(dataTableConfig.filterVariants),
  operator: z.enum(dataTableConfig.operators),
  filterId: z.string(),
});

export type FilterItemSchema = z.infer<typeof filterItemSchema>;

export const getFiltersStateParser = <TData>(
  columnIds?: string[] | Set<string>,
) => {
  const validKeys = columnIds
    ? columnIds instanceof Set
      ? columnIds
      : new Set(columnIds)
    : null;

  return {
    parse: (value: string) => {
      try {
        const parsed = JSON.parse(value);
        const result = z.array(filterItemSchema).safeParse(parsed);

        if (!result.success) return [];

        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return [];
        }

        return result.data as ExtendedColumnFilter<TData>[];
      } catch {
        return [];
      }
    },
    serialize: (value: ExtendedColumnFilter<TData>[]) => JSON.stringify(value),
  };
};

// Utilities pour Vue Router
export const parseSearchParam = (value: string | string[] | undefined, defaultValue: any = undefined) => {
  if (!value) return defaultValue;
  if (Array.isArray(value)) return value[0] || defaultValue;
  return value;
};

export const parseNumberParam = (value: string | string[] | undefined, defaultValue: number = 0) => {
  const parsed = parseSearchParam(value);
  const number = Number(parsed);
  return isNaN(number) ? defaultValue : number;
};

export const parseBooleanParam = (value: string | string[] | undefined, defaultValue: boolean = false) => {
  const parsed = parseSearchParam(value);
  if (parsed === 'true') return true;
  if (parsed === 'false') return false;
  return defaultValue;
};

export const parseArrayParam = (value: string | string[] | undefined, separator: string = ',', defaultValue: string[] = []) => {
  const parsed = parseSearchParam(value);
  if (!parsed) return defaultValue;
  return parsed.split(separator).filter(Boolean);
};
