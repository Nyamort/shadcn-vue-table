<template>
  <Popover>
    <PopoverTrigger as-child>
      <button
        :aria-label="`Filter by ${title}`"
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
      >
        <PlusCircle class="mr-2 h-4 w-4" />
        {{ title }}
        <template v-if="selectedValues.size > 0">
          <Separator orientation="vertical" class="mx-2 h-4" />
          <Badge
            variant="secondary"
            class="rounded-sm px-1 font-normal lg:hidden"
          >
            {{ selectedValues.size }}
          </Badge>
          <div class="hidden space-x-1 lg:flex">
            <template v-if="selectedValues.size > 2">
              <Badge
                variant="secondary"
                class="rounded-sm px-1 font-normal"
              >
                {{ selectedValues.size }} selected
              </Badge>
            </template>
            <template v-else>
              <Badge
                v-for="option in options.filter((option) => selectedValues.has(option.value))"
                :key="option.value"
                variant="secondary"
                class="rounded-sm px-1 font-normal"
              >
                {{ option.label }}
              </Badge>
            </template>
          </div>
        </template>
      </button>
    </PopoverTrigger>
    
    <PopoverContent class="w-48 p-0" align="start">
      <Command>
        <CommandInput :placeholder="title" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="option in options"
              :key="option.value"
              :value="option.value"
              @select="toggleOption(option.value)"
            >
              <div
                :class="cn(
                  'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                  selectedValues.has(option.value)
                    ? 'bg-primary text-primary-foreground'
                    : 'opacity-50 [&_svg]:invisible'
                )"
              >
                <Check class="h-4 w-4" />
              </div>
              <template v-if="option.icon">
                <component :is="option.icon" class="mr-2 h-4 w-4 text-muted-foreground" />
              </template>
              <span>{{ option.label }}</span>
              <template v-if="facets?.get(option.value)">
                <span class="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                  {{ facets.get(option.value) }}
                </span>
              </template>
            </CommandItem>
          </CommandGroup>
          
          <template v-if="selectedValues.size > 0">
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                :value="'clear'"
                class="justify-center text-center"
                @select="clearFilters"
              >
                Clear filters
              </CommandItem>
            </CommandGroup>
          </template>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts" generic="TData">
import type { Column } from '@tanstack/vue-table'
import { Check, PlusCircle } from 'lucide-vue-next'
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

interface Option {
  label: string
  value: string
  icon?: any
}

interface Props {
  column?: Column<TData, unknown>
  title?: string
  options: Option[]
}

const props = defineProps<Props>()

const facets = computed(() => props.column?.getFacetedUniqueValues())
const selectedValues = computed(() => new Set(props.column?.getFilterValue() as string[]))

const toggleOption = (value: string) => {
  const filterValues = Array.from(selectedValues.value)
  if (selectedValues.value.has(value)) {
    props.column?.setFilterValue(filterValues.filter((item) => item !== value))
  } else {
    props.column?.setFilterValue([...filterValues, value])
  }
}

const clearFilters = () => {
  props.column?.setFilterValue(undefined)
}
</script>
