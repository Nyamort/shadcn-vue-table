import type {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  TableOptions,
  VisibilityState,
} from '@tanstack/vue-table'
import {
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ref, computed, watch, toValue } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { MaybeRef } from 'vue'
import { useDebouncedRef } from './use-debounced-ref'
import { getSortingStateParser } from '@/lib/parsers'
import type { ExtendedColumnSort } from '@/types/data-table'

const PAGE_KEY = 'page'
const PER_PAGE_KEY = 'perPage'
const SORT_KEY = 'sort'
const ARRAY_SEPARATOR = ','
const DEBOUNCE_MS = 300
const THROTTLE_MS = 50

interface UseDataTableOptions<TData>
  extends Omit<
    TableOptions<TData>,
    | 'state'
    | 'pageCount'
    | 'getCoreRowModel'
    | 'manualFiltering'
    | 'manualPagination'
    | 'manualSorting'
  > {
  pageCount?: number
  enableAdvancedFilter?: boolean
  shallow?: boolean
  clearOnDefault?: boolean
  debounceMs?: number
  throttleMs?: number
}

export function useDataTable<TData>(options: UseDataTableOptions<TData>) {
  const router = useRouter()
  const route = useRoute()
  
  const {
    pageCount = -1,
    enableAdvancedFilter = false,
    shallow = true,
    clearOnDefault = false,
    debounceMs = DEBOUNCE_MS,
    throttleMs = THROTTLE_MS,
    ...tableOptions
  } = options

  // URL state management
  const createQueryUpdater = (key: string, defaultValue?: any, parser?: any) => {
    const getValue = () => {
      const value = route.query[key]
      if (value === undefined) return defaultValue
      return parser ? parser.parse(value) : value
    }

    const setValue = (value: any) => {
      const query = { ...route.query }
      if (value === defaultValue || value === undefined) {
        delete query[key]
      } else {
        query[key] = parser ? parser.serialize(value) : String(value)
      }
      router.push({ query })
    }

    return { getValue, setValue }
  }

  // State management
  const pageUpdater = createQueryUpdater(PAGE_KEY, 1, {
    parse: (value: string) => Number(value),
    serialize: (value: number) => String(value)
  })

  const perPageUpdater = createQueryUpdater(PER_PAGE_KEY, 10, {
    parse: (value: string) => Number(value),
    serialize: (value: number) => String(value)
  })

  const sortUpdater = createQueryUpdater(SORT_KEY, [], getSortingStateParser())

  // Reactive state
  const pagination = ref<PaginationState>({
    pageIndex: pageUpdater.getValue() - 1,
    pageSize: perPageUpdater.getValue(),
  })

  const sorting = ref<SortingState>(sortUpdater.getValue())
  const columnFilters = ref<ColumnFiltersState>([])
  const columnVisibility = ref<VisibilityState>({})
  const rowSelection = ref<RowSelectionState>({})

  // Debounced refs for performance
  const debouncedColumnFilters = useDebouncedRef(columnFilters, debounceMs)
  const debouncedGlobalFilter = useDebouncedRef(ref(''), debounceMs)

  // Table instance
  const table = useVueTable({
    ...tableOptions,
    state: {
      pagination: pagination.value,
      sorting: sorting.value,
      columnFilters: shallow ? debouncedColumnFilters.value : columnFilters.value,
      columnVisibility: columnVisibility.value,
      rowSelection: rowSelection.value,
      globalFilter: debouncedGlobalFilter.value,
    },
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualFiltering: enableAdvancedFilter,
    manualPagination: true,
    manualSorting: enableAdvancedFilter,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' 
        ? updater(pagination.value) 
        : updater
      pagination.value = newPagination
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' 
        ? updater(sorting.value) 
        : updater
      sorting.value = newSorting
    },
    onColumnFiltersChange: (updater) => {
      const newFilters = typeof updater === 'function' 
        ? updater(columnFilters.value) 
        : updater
      columnFilters.value = newFilters
    },
    onColumnVisibilityChange: (updater) => {
      const newVisibility = typeof updater === 'function' 
        ? updater(columnVisibility.value) 
        : updater
      columnVisibility.value = newVisibility
    },
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === 'function' 
        ? updater(rowSelection.value) 
        : updater
      rowSelection.value = newSelection
    },
  })

  // Watch for changes and update URL
  watch(
    () => pagination.value.pageIndex,
    (newPageIndex) => {
      pageUpdater.setValue(newPageIndex + 1)
    }
  )

  watch(
    () => pagination.value.pageSize,
    (newPageSize) => {
      perPageUpdater.setValue(newPageSize)
    }
  )

  watch(
    sorting,
    (newSorting) => {
      sortUpdater.setValue(newSorting)
    },
    { deep: true }
  )

  return {
    table,
    shallow,
    debounceMs,
    throttleMs,
  }
}
