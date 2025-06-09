<template>
  <div
    :class="cn('flex w-full flex-col gap-2.5 overflow-auto', className)"
    v-bind="$attrs"
  >
    <slot />
    
    <div class="overflow-hidden rounded-md border">
      <table class="w-full caption-bottom text-sm">
        <thead class="[&_tr]:border-b">
          <tr 
            v-for="headerGroup in table.getHeaderGroups()" 
            :key="headerGroup.id"
            class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
          >
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              :colspan="header.colSpan"
              :style="{
                ...getCommonPinningStyles({ column: header.column }),
              }"
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
            >
              <template v-if="!header.isPlaceholder">
                <FlexRender
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </template>
            </th>
          </tr>
        </thead>
        <tbody class="[&_tr:last-child]:border-0">
          <template v-if="table.getRowModel().rows?.length">
            <tr
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() && 'selected'"
              class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            >
              <td
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                :style="{
                  ...getCommonPinningStyles({ column: cell.column }),
                }"
                class="p-4 align-middle [&:has([role=checkbox])]:pr-0"
              >
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </td>
            </tr>
          </template>
          <tr v-else>
            <td
              :colspan="table.getAllColumns().length"
              class="h-24 text-center p-4 align-middle"
            >
              No results.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="flex flex-col gap-2.5">
      <DataTablePagination :table="table" />
      <template v-if="actionBar && table.getFilteredSelectedRowModel().rows.length > 0">
        <component :is="actionBar" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts" generic="TData">
import type { Table as TanstackTable } from '@tanstack/vue-table'
import { FlexRender } from '@tanstack/vue-table'
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { getCommonPinningStyles } from '@/lib/data-table'
import DataTablePagination from './DataTablePagination.vue'

interface Props {
  table: TanstackTable<TData>
  actionBar?: any
  className?: string
}

const props = defineProps<Props>()
</script>
