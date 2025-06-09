<template>
  <div class="flex flex-wrap items-center gap-2">
    <template v-for="filter in filters" :key="filter.id">
      <Badge variant="outline" class="h-6 rounded-md px-2 font-normal">
        {{ filter.label }}
        <button
          @click="removeFilter(filter.id, filter.value)"
          class="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X class="h-3 w-3" />
        </button>
      </Badge>
    </template>
    
    <template v-if="filters.length > 0">
      <button
        @click="clearAllFilters"
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-dashed border-input bg-background hover:bg-accent hover:text-accent-foreground h-6 px-2"
      >
        Clear all
      </button>
    </template>
  </div>
</template>

<script setup lang="ts" generic="TData">
import type { Table } from '@tanstack/vue-table'
import { X } from 'lucide-vue-next'
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'

interface Props {
  table: Table<TData>
  shallow?: boolean
  debounceMs?: number
  throttleMs?: number
  align?: 'start' | 'center' | 'end'
}

const props = defineProps<Props>()

const filters = computed(() => {
  return props.table.getState().columnFilters.map(filter => {
    const column = props.table.getColumn(filter.id)
    const columnMeta = column?.columnDef.meta
    
    let label = columnMeta?.label ?? filter.id
    let value = filter.value
    
    if (Array.isArray(value)) {
      label += `: ${value.length} selected`
    } else if (typeof value === 'string') {
      label += `: ${value}`
    } else if (Array.isArray(value) && value.length === 2) {
      label += `: ${value[0]} - ${value[1]}`
    }
    
    return {
      id: filter.id,
      label,
      value: filter.value
    }
  })
})

const removeFilter = (columnId: string, value: any) => {
  const column = props.table.getColumn(columnId)
  if (column) {
    column.setFilterValue(undefined)
  }
}

const clearAllFilters = () => {
  props.table.resetColumnFilters()
}
</script>
