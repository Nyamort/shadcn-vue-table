<template>
  <Popover>
    <PopoverTrigger as-child>
      <button
        :aria-label="`Filter by ${title}`"
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
      >
        <SlidersHorizontal class="mr-2 h-4 w-4" />
        {{ title }}
        <template v-if="filterValue">
          <Separator orientation="vertical" class="mx-2 h-4" />
          <Badge variant="secondary" class="rounded-sm px-1 font-normal">
            {{ filterValue[0] }} - {{ filterValue[1] }}
          </Badge>
        </template>
      </button>
    </PopoverTrigger>
    
    <PopoverContent class="w-80 p-4" align="start">
      <div class="space-y-4">
        <div>
          <h4 class="font-medium text-sm">{{ title }}</h4>
          <p class="text-muted-foreground text-xs">
            Set the range of values to filter by.
          </p>
        </div>
        
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm">{{ min }}</span>
            <span class="text-sm">{{ max }}</span>
          </div>
          
          <div class="px-3">
            <input
              type="range"
              :min="min"
              :max="max"
              :value="filterValue?.[0] ?? min"
              @input="updateRange(0, $event)"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="range"
              :min="min"
              :max="max"
              :value="filterValue?.[1] ?? max"
              @input="updateRange(1, $event)"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1"
            />
          </div>
          
          <div class="flex items-center justify-between text-sm">
            <div>Min: {{ filterValue?.[0] ?? min }}</div>
            <div>Max: {{ filterValue?.[1] ?? max }}</div>
          </div>
        </div>
        
        <div class="flex items-center justify-between pt-2">
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
import { SlidersHorizontal } from 'lucide-vue-next'
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

interface Props {
  column?: Column<TData, unknown>
  title?: string
  options?: { min: number; max: number }
}

const props = defineProps<Props>()

const filterValue = computed(() => props.column?.getFilterValue() as [number, number] | undefined)

const min = computed(() => props.options?.min ?? 0)
const max = computed(() => props.options?.max ?? 100)

const updateRange = (index: number, event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  const currentValue = filterValue.value ?? [min.value, max.value]
  const newValue: [number, number] = [...currentValue] as [number, number]
  newValue[index] = value
  
  // Ensure min <= max
  if (index === 0 && value > newValue[1]) {
    newValue[1] = value
  } else if (index === 1 && value < newValue[0]) {
    newValue[0] = value
  }
  
  props.column?.setFilterValue(newValue)
}

const clearFilter = () => {
  props.column?.setFilterValue(undefined)
}
</script>
