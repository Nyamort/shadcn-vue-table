<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button
        aria-label="Open filter menu"
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
      >
        <Filter class="mr-2 h-4 w-4" />
        Filter
        <template v-if="activeFiltersCount > 0">
          <Separator orientation="vertical" class="mx-2 h-4" />
          <Badge variant="secondary" class="rounded-sm px-1 font-normal">
            {{ activeFiltersCount }}
          </Badge>
        </template>
      </button>
    </DropdownMenuTrigger>
    
    <DropdownMenuContent align="start" class="w-56">
      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
      <DropdownMenuSeparator />
      
      <template v-for="column in filterableColumns" :key="column.id">
        <DropdownMenuItem @select="(e) => e.preventDefault()">
          <DataTableToolbarFilter :column="column" />
        </DropdownMenuItem>
      </template>
      
      <template v-if="activeFiltersCount > 0">
        <DropdownMenuSeparator />
        <DropdownMenuItem @select="clearAllFilters">
          Clear filters
        </DropdownMenuItem>
      </template>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts" generic="TData">
import type { Table } from '@tanstack/vue-table'
import { Filter } from 'lucide-vue-next'
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import DataTableToolbarFilter from './DataTableToolbarFilter.vue'

interface Props {
  table: Table<TData>
  shallow?: boolean
  debounceMs?: number
  throttleMs?: number
}

const props = defineProps<Props>()

const filterableColumns = computed(() =>
  props.table.getAllColumns().filter((column) => column.getCanFilter())
)

const activeFiltersCount = computed(() => props.table.getState().columnFilters.length)

const clearAllFilters = () => {
  props.table.resetColumnFilters()
}
</script>
