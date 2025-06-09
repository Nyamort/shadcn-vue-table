<template>
  <div
    :class="cn(
      'flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8',
      className,
    )"
    v-bind="$attrs"
  >
    <div class="flex-1 whitespace-nowrap text-muted-foreground text-sm">
      {{ table.getFilteredSelectedRowModel().rows.length }} of
      {{ table.getFilteredRowModel().rows.length }} row(s) selected.
    </div>
    
    <div class="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
      <div class="flex items-center space-x-2">
        <p class="whitespace-nowrap font-medium text-sm">Rows per page</p>
        <select
          :value="table.getState().pagination.pageSize"
          @change="table.setPageSize(Number(($event.target as HTMLSelectElement).value))"
          class="flex h-8 w-[4.5rem] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option
            v-for="pageSize in pageSizeOptions"
            :key="pageSize"
            :value="pageSize"
          >
            {{ pageSize }}
          </option>
        </select>
      </div>
      
      <div class="flex items-center justify-center font-medium text-sm">
        Page {{ table.getState().pagination.pageIndex + 1 }} of
        {{ table.getPageCount() }}
      </div>
      
      <div class="flex items-center space-x-2">
        <button
          aria-label="Go to first page"
          :disabled="!table.getCanPreviousPage()"
          @click="table.setPageIndex(0)"
          class="hidden size-8 lg:flex inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <ChevronsLeft class="h-4 w-4" />
        </button>
        
        <button
          aria-label="Go to previous page"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
          class="size-8 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <ChevronLeft class="h-4 w-4" />
        </button>
        
        <button
          aria-label="Go to next page"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
          class="size-8 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <ChevronRight class="h-4 w-4" />
        </button>
        
        <button
          aria-label="Go to last page"
          :disabled="!table.getCanNextPage()"
          @click="table.setPageIndex(table.getPageCount() - 1)"
          class="hidden size-8 lg:flex inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <ChevronsRight class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="TData">
import type { Table } from '@tanstack/vue-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  table: Table<TData>
  pageSizeOptions?: number[]
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  pageSizeOptions: () => [10, 20, 30, 40, 50]
})
</script>
