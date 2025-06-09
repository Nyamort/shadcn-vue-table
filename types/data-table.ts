import type { Component } from 'vue'

export interface DataTableRowAction<TData> {
  variant: 'update' | 'delete' | 'view'
  row: {
    original: TData
    toggleSelected: (selected: boolean) => void
  }
}

export interface ExtendedColumnSort<TData = unknown> {
  id: string
  desc: boolean
}

// Filter types
export type FilterVariant =
  | 'text'
  | 'number'
  | 'range'
  | 'date'
  | 'dateRange'
  | 'boolean'
  | 'select'
  | 'multiSelect'

export type FilterOperator =
  | 'iLike'
  | 'notILike'
  | 'eq'
  | 'ne'
  | 'inArray'
  | 'notInArray'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte'
  | 'isBetween'
  | 'isRelativeToToday'

export interface ExtendedColumnFilter<TData = unknown> {
  id: string
  value: any
  variant: FilterVariant
  operator: FilterOperator
  filterId: string
}

export interface DataTableFilterOption {
  label: string
  value: string
  icon?: Component
  count?: number
}

export interface DataTableColumnMeta {
  label?: string
  variant?: FilterVariant
  placeholder?: string
  options?: DataTableFilterOption[] | { min: number; max: number }
}

// Types pour les composants Vue
export interface VueDataTableProps<TData = unknown> {
  table: any // Table type from @tanstack/vue-table
  className?: string
}

export interface VueDataTablePaginationProps<TData = unknown> extends VueDataTableProps<TData> {
  pageSizeOptions?: number[]
}

export interface VueDataTableToolbarProps<TData = unknown> extends VueDataTableProps<TData> {}

export interface VueDataTableFilterProps<TData = unknown> {
  column?: any // Column type from @tanstack/vue-table
  title?: string
  options?: DataTableFilterOption[] | { min: number; max: number }
}

// Feature flags
export interface FeatureFlags {
  enableAdvancedFilter: boolean
  filterFlag: 'advancedFilters' | 'filterMenu'
}

// Task related types (adaptez selon votre schéma de base de données)
export interface Task {
  id: string
  code: string
  title: string
  status: 'todo' | 'in-progress' | 'done' | 'canceled'
  priority: 'low' | 'medium' | 'high'
  estimatedHours: number
  createdAt: Date
  updatedAt: Date
}

// Utilitaires pour Vue Router
export interface DataTableSearchParams {
  page?: number
  perPage?: number
  sort?: string
  [key: string]: any
}
