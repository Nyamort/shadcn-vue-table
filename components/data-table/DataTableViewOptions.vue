<template>
  <div class="ml-auto">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <button
          aria-label="Toggle columns"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
        >
          <Settings2 class="mr-2 h-4 w-4" />
          View
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" class="w-40">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuCheckboxItem
          v-for="column in columns"
          :key="column.id"
          :checked="column.getIsVisible()"
          @checked-change="column.toggleVisibility()"
          class="capitalize"
        >
          {{ column.id }}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>

<script setup lang="ts" generic="TData">
import type { Table } from '@tanstack/vue-table'
import { Settings2 } from 'lucide-vue-next'
import { computed } from 'vue'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Props {
  table: Table<TData>
}

const props = defineProps<Props>()

const columns = computed(() =>
  props.table
    .getAllColumns()
    .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
)
</script>
