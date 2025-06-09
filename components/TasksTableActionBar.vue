<template>
  <div class="flex items-center gap-2">
    <template v-if="table.getFilteredSelectedRowModel().rows.length > 0">
      <Button
        variant="outline"
        size="sm"
        @click="showDeleteDialog = true"
      >
        <Trash2 class="mr-2 h-4 w-4" />
        Delete ({{ table.getFilteredSelectedRowModel().rows.length }})
      </Button>
    </template>
    
    <DeleteTasksDialog
      :open="showDeleteDialog"
      :tasks="selectedTasks"
      :show-trigger="false"
      @update:open="showDeleteDialog = $event"
      @success="handleDeleteSuccess"
    />
  </div>
</template>

<script setup lang="ts" generic="TData">
import type { Table } from '@tanstack/vue-table'
import type { Task } from '@/db/schema'
import { Trash2 } from 'lucide-vue-next'
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import DeleteTasksDialog from './DeleteTasksDialog.vue'

interface Props {
  table: Table<TData>
}

const props = defineProps<Props>()

const showDeleteDialog = ref(false)

const selectedTasks = computed(() => 
  props.table.getFilteredSelectedRowModel().rows.map(row => row.original as Task)
)

const handleDeleteSuccess = () => {
  // Désélectionner toutes les lignes après suppression
  props.table.toggleAllRowsSelected(false)
}
</script>
