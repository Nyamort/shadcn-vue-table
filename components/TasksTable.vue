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
import { getTasksTableColumns } from './tasks-table-columns'

import DataTable from '@/components/data-table/DataTable.vue'
import DataTableAdvancedToolbar from '@/components/data-table/DataTableAdvancedToolbar.vue'
import DataTableFilterList from '@/components/data-table/DataTableFilterList.vue'
import DataTableFilterMenu from '@/components/data-table/DataTableFilterMenu.vue'
import DataTableSortList from '@/components/data-table/DataTableSortList.vue'
import DataTableToolbar from '@/components/data-table/DataTableToolbar.vue'
import TasksTableActionBar from './TasksTableActionBar.vue'
import UpdateTaskSheet from './UpdateTaskSheet.vue'
import DeleteTasksDialog from './DeleteTasksDialog.vue'

interface Props {
  data: Task[]
  pageCount: number
  statusCounts: Record<string, number>
  priorityCounts: Record<string, number>
  estimatedHoursRange: [number, number]
}

const props = defineProps<Props>()

// Feature flags
const { enableAdvancedFilter, filterFlag } = useFeatureFlags()

// Row action state
const rowAction = ref<DataTableRowAction<Task> | null>(null)

// Table columns
const columns = computed(() =>
    getTasksTableColumns({
      statusCounts: props.statusCounts,
      priorityCounts: props.priorityCounts,
      estimatedHoursRange: props.estimatedHoursRange,
      setRowAction: (action) => {
        rowAction.value = action
      },
    })
)

// Data table setup
const { table, shallow, debounceMs, throttleMs, setData } = useDataTable({
  data: props.data,
  columns: columns.value,
  pageCount: props.pageCount,
  enableAdvancedFilter: enableAdvancedFilter.value,
  initialState: {
    sorting: [{ id: 'createdAt', desc: true }],
    columnPinning: { right: ['actions'] },
  },
  getRowId: (originalRow) => originalRow.id,
  shallow: false,
  clearOnDefault: true,
})

// Event handlers
const handleSheetClose = () => {
  rowAction.value = null
}

const handleDeleteSuccess = () => {
  if (rowAction.value?.row) {
    rowAction.value.row.toggleSelected(false)
  }
}

watch(
    () => props.data,
    (newData) => {
      setData(newData)
    }
)
</script>
