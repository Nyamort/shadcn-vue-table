<template>
  <div>
    <template v-if="columnMeta?.variant === 'text'">
      <input
        type="text"
        :placeholder="columnMeta.placeholder ?? columnMeta.label"
        :value="(column.getFilterValue() as string) ?? ''"
        @input="column.setFilterValue(($event.target as HTMLInputElement).value)"
        class="flex h-8 w-40 lg:w-56 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </template>
    
    <template v-else-if="columnMeta?.variant === 'number'">
      <div class="relative">
        <input
          type="number"
          inputmode="numeric"
          :placeholder="columnMeta.placeholder ?? columnMeta.label"
          :value="(column.getFilterValue() as string) ?? ''"
          @input="column.setFilterValue(($event.target as HTMLInputElement).value)"
          class="flex h-8 w-40 lg:w-56 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </template>
    
    <template v-else-if="columnMeta?.variant === 'range'">
      <DataTableSliderFilter
        :column="column"
        :title="columnMeta.label"
        :options="columnMeta.options"
      />
    </template>
    
    <template v-else-if="columnMeta?.variant === 'select'">
      <DataTableFacetedFilter
        :column="column"
        :title="columnMeta.label"
        :options="columnMeta.options"
      />
    </template>
    
    <template v-else-if="columnMeta?.variant === 'multi-select'">
      <DataTableFacetedFilter
        :column="column"
        :title="columnMeta.label"
        :options="columnMeta.options"
      />
    </template>
    
    <template v-else-if="columnMeta?.variant === 'date'">
      <DataTableDateFilter
        :column="column"
        :title="columnMeta.label"
        :options="columnMeta.options"
      />
    </template>
  </div>
</template>

<script setup lang="ts" generic="TData">
import type { Column } from '@tanstack/vue-table'
import { computed } from 'vue'
import DataTableSliderFilter from './DataTableSliderFilter.vue'
import DataTableFacetedFilter from './DataTableFacetedFilter.vue'
import DataTableDateFilter from './DataTableDateFilter.vue'

interface Props {
  column: Column<TData>
}

const props = defineProps<Props>()

const columnMeta = computed(() => props.column.columnDef.meta)
</script>
