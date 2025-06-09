<template>
  <div class="container mx-auto py-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Tasks</h1>
        <p class="text-muted-foreground">
          Manage your tasks with advanced filtering and sorting capabilities.
        </p>
      </div>
    </div>

    <Suspense>
      <TasksTable
        :data="data"
        :page-count="pageCount"
        :status-counts="statusCounts"
        :priority-counts="priorityCounts"
        :estimated-hours-range="estimatedHoursRange"
      />
      
      <template #fallback>
        <div class="flex items-center justify-center p-8">
          <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Task } from '@/types/vue-data-table'
import { api } from '@/lib/mock-api'
import TasksTable from '@/components/TasksTable.vue'

const data = ref<Task[]>([])
const pageCount = ref(0)
const statusCounts = ref<Record<string, number>>({})
const priorityCounts = ref<Record<string, number>>({})
const estimatedHoursRange = ref<[number, number]>([0, 100])

const loadData = async () => {
  try {
    const [tasksResult, statusCountsResult, priorityCountsResult, hoursRangeResult] = await Promise.all([
      api.getTasks(1, 100),
      api.getTaskStatusCounts(),
      api.getTaskPriorityCounts(),
      api.getEstimatedHoursRange()
    ])
    
    data.value = tasksResult.data
    pageCount.value = tasksResult.pageCount
    statusCounts.value = statusCountsResult
    priorityCounts.value = priorityCountsResult
    estimatedHoursRange.value = hoursRangeResult
  } catch (error) {
    console.error('Error loading tasks:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>
