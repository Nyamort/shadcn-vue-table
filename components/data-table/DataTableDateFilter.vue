<template>
  <Popover>
    <PopoverTrigger as-child>
      <button
        :aria-label="`Filter by ${title}`"
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
      >
        <CalendarDays class="mr-2 h-4 w-4" />
        {{ title }}
        <template v-if="filterValue">
          <Separator orientation="vertical" class="mx-2 h-4" />
          <Badge variant="secondary" class="rounded-sm px-1 font-normal">
            {{ formatDateRange(filterValue) }}
          </Badge>
        </template>
      </button>
    </PopoverTrigger>
    
    <PopoverContent class="w-auto p-0" align="start">
      <Calendar
        :selected="filterValue"
        @update:selected="handleDateChange"
        mode="range"
        :number-of-months="2"
      />
      
      <div class="p-3 border-t">
        <div class="flex items-center justify-between">
          <button
            @click="clearFilter"
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
          >
            Clear
          </button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts" generic="TData">
import type { Column } from '@tanstack/vue-table'
import { CalendarDays } from 'lucide-vue-next'
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

interface Props {
  column?: Column<TData, unknown>
  title?: string
  options?: any
}

const props = defineProps<Props>()

const filterValue = computed(() => props.column?.getFilterValue() as [Date, Date] | undefined)

const formatDateRange = (dates: [Date, Date]) => {
  if (!dates || !dates[0]) return ''
  if (!dates[1]) return dates[0].toLocaleDateString()
  return `${dates[0].toLocaleDateString()} - ${dates[1].toLocaleDateString()}`
}

const handleDateChange = (dates: [Date, Date] | undefined) => {
  props.column?.setFilterValue(dates)
}

const clearFilter = () => {
  props.column?.setFilterValue(undefined)
}
</script>
