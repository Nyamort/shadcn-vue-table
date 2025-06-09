<template>
  <div>
    <DataTable
      :table="table"
      :action-bar="TasksTableActionBar"
    >
      <DataTableAdvancedToolbar 
        v-if="enableAdvancedFilter" 
        :table="table"
      >
        <DataTableSortList :table="table" align="start" />
        <DataTableFilterList
          v-if="filterFlag === 'advancedFilters'"
          :table="table"
          :shallow="shallow"
          :debounce-ms="debounceMs"
          :throttle-ms="throttleMs"
          align="start"
        />
        <DataTableFilterMenu
          v-else
          :table="table"
          :shallow="shallow"
          :debounce-ms="debounceMs"
          :throttle-ms="throttleMs"
        />
      </DataTableAdvancedToolbar>
      
      <DataTableToolbar v-else :table="table">
        <DataTableSortList :table="table" align="end" />
      </DataTableToolbar>
    </DataTable>
    
    <UpdateTaskSheet
      :open="rowAction?.variant === 'update'"
      :task="rowAction?.row.original ?? null"
      @update:open="handleSheetClose"
    />
    
    <DeleteTasksDialog
      :open="rowAction?.variant === 'delete'"
      :tasks="rowAction?.row.original ? [rowAction?.row.original] : []"
      :show-trigger="false"
      @update:open="handleSheetClose"
      @success="handleDeleteSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import type { Task } from '@/db/schema'
import type { DataTableRowAction } from '@/types/data-table'
import { ref, computed, watch } from 'vue'
import { useDataTable } from '@/composables/use-data-table'
import { useFeatureFlags } from '@/composables/use-feature-flags'
import { getTasksTableColumns } from './tasks-table-columns.ts'

import DataTable from '@/components/data-table/DataTable.vue'
import DataTableAdvancedToolbar from '@/components/data-table/DataTableAdvancedToolbar.vue'
import DataTableFilterList from '@/components/data-table/DataTableFilterList.vue'
import DataTableFilterMenu from '@/components/data-table/DataTableFilterMenu.vue'
import DataTableSortList from '@/components/data-table/DataTableSortList.vue'
import DataTableToolbar from '@/components/data-table/DataTableToolbar.vue'
import TasksTableActionBar from './TasksTableActionBar.vue'
import UpdateTaskSheet from './UpdateTaskSheet.vue'
import DeleteTasksDialog from './DeleteTasksDialog.vue'

const props = defineProps<{
  promises: Promise<
    [
      Awaited<ReturnType<typeof getTasks>>,
      Awaited<ReturnType<typeof getTaskStatusCounts>>,
      Awaited<ReturnType<typeof getTaskPriorityCounts>>,
      Awaited<ReturnType<typeof getEstimatedHoursRange>>
    ]
  >
}>()

const rowAction = ref(null)
const {
  enableAdvancedFilter,
  filterFlag,
} = useFeatureFlags()

const data = ref([])
const pageCount = ref(0)
const statusCounts = ref([])
const priorityCounts = ref([])
const estimatedHoursRange = ref([])

onMounted(async () => {
  const [tasks, status, priority, estimated] = await props.promises
  data.value = tasks.data
  pageCount.value = tasks.pageCount
  statusCounts.value = status
  priorityCounts.value = priority
  estimatedHoursRange.value = estimated
})

const columns = computed(() => {
  return getTasksTableColumns({
    statusCounts: statusCounts.value,
    priorityCounts: priorityCounts.value,
    estimatedHoursRange: estimatedHoursRange.value,
    setRowAction: (action) => (rowAction.value = action),
  })
})

const {
  table,
  shallow,
  debounceMs,
  throttleMs,
} = useDataTable({
  data: data.value,
  columns: columns.value,
  pageCount: pageCount.value,
  enableAdvancedFilter: enableAdvancedFilter.value,
  initialState: {
    sorting: [{ id: 'createdAt', desc: true }],
    columnPinning: { right: ['actions'] },
  },
  getRowId: (row) => row.id,
  shallow: false,
  clearOnDefault: true,
})
</script>
