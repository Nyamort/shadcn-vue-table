<template>
  <div
    :class="cn(
      'flex w-full items-start justify-between gap-2 p-1',
      className,
    )"
    v-bind="$attrs"
  >
    <div class="flex flex-1 flex-wrap items-center gap-2">
      <slot />
    </div>
    
    <div class="flex items-center gap-2">
      <DataTableViewOptions :table="table" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="TData">
import type { Table } from '@tanstack/vue-table'
import { cn } from '@/lib/utils'
import DataTableViewOptions from './DataTableViewOptions.vue'

interface Props {
  table: Table<TData>
  className?: string
}

const props = defineProps<Props>()
</script>
