<template>
  <div class="flex flex-wrap items-center gap-2">
    <template v-for="sort in sortingState" :key="sort.id">
      <Badge variant="outline" class="h-6 rounded-md px-2 font-normal">
        {{ getColumnLabel(sort.id) }}
        <ArrowUp v-if="!sort.desc" class="ml-1 h-3 w-3" />
        <ArrowDown v-else class="ml-1 h-3 w-3" />
        <button
          @click="removeSort(sort.id)"
          class="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X class="h-3 w-3" />
        </button>
      </Badge>
    </template>
    
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <button
          aria-label="Add sort"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-dashed border-input bg-background hover:bg-accent hover:text-accent-foreground h-6 px-2"
        >
          <Plus class="mr-1 h-3 w-3" />
          Sort
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent :align="align" class="w-40">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <template v-for="column in sortableColumns" :key="column.id">
          <DropdownMenuSub v-if="!column.getIsSorted()">
            <DropdownMenuSubTrigger>
              {{ getColumnLabel(column.id) }}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem @select="addSort(column.id, false)">
                <ArrowUp class="mr-2 h-4 w-4" />
                Asc
              </DropdownMenuItem>
              <DropdownMenuItem @select="addSort(column.id, true)">
                <ArrowDown class="mr-2 h-4 w-4" />
                Desc
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </template>
        
        <template v-if="sortingState.length > 0">
          <DropdownMenuSeparator />
          <DropdownMenuItem @select="clearSorting">
            Clear sorting
          </DropdownMenuItem>
        </template>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>

<script setup lang="ts" generic="TData">
import type { Table } from '@tanstack/vue-table'
import { ArrowUp, ArrowDown, Plus, X } from 'lucide-vue-next'
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Props {
  table: Table<TData>
  align?: 'start' | 'center' | 'end'
}

const props = withDefaults(defineProps<Props>(), {
  align: 'start'
})

const sortingState = computed(() => props.table.getState().sorting)

const sortableColumns = computed(() =>
  props.table.getAllColumns().filter((column) => column.getCanSort())
)

const getColumnLabel = (columnId: string) => {
  const column = props.table.getColumn(columnId)
  return column?.columnDef.meta?.label ?? columnId
}

const addSort = (columnId: string, desc: boolean) => {
  const column = props.table.getColumn(columnId)
  if (column) {
    column.toggleSorting(desc)
  }
}

const removeSort = (columnId: string) => {
  const column = props.table.getColumn(columnId)
  if (column) {
    column.clearSorting()
  }
}

const clearSorting = () => {
  props.table.resetSorting()
}
</script>
