<template>
  <div
    role="toolbar"
    aria-orientation="horizontal"
    :class="cn(
      'flex w-full items-start justify-between gap-2 p-1',
      className,
    )"
    v-bind="$attrs"
  >
    <div class="flex flex-1 flex-wrap items-center gap-2">
      <DataTableToolbarFilter
        v-for="column in filterableColumns"
        :key="column.id"
        :column="column"
      />
      
      <button
        v-if="isFiltered"
        aria-label="Reset filters"
        @click="onReset"
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-dashed border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
      >
        <X class="mr-2 h-4 w-4" />
        Reset
      </button>
    </div>
    
    <div class="flex items-center gap-2">
      <slot />
      <DataTableViewOptions :table="table" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="TData">
import type { Table } from '@tanstack/vue-table'
import { X } from 'lucide-vue-next'
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import DataTableToolbarFilter from './DataTableToolbarFilter.vue'
import DataTableViewOptions from './DataTableViewOptions.vue'

interface Props {
  table: Table<TData>
  className?: string
}

const props = defineProps<Props>()

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)

const filterableColumns = computed(() => 
  props.table.getAllColumns().filter((column) => column.getCanFilter())
)

const onReset = () => {
  props.table.resetColumnFilters()
}
</script>
