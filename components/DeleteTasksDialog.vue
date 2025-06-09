<template>
  <AlertDialog :open="open" @update:open="$emit('update:open', $event)">
    <AlertDialogTrigger v-if="showTrigger" as-child>
      <Button variant="outline" size="sm">
        <Trash2 class="mr-2 h-4 w-4" />
        Delete ({{ tasks.length }})
      </Button>
    </AlertDialogTrigger>
    
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete 
          {{ tasks.length === 1 ? 'this task' : `these ${tasks.length} tasks` }} 
          from the database.
        </AlertDialogDescription>
      </AlertDialogHeader>
      
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          @click="handleDelete"
          :disabled="isDeleting"
          class="bg-red-600 hover:bg-red-700"
        >
          <template v-if="isDeleting">
            <div class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            Deleting...
          </template>
          <template v-else>
            Delete
          </template>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import type { Task } from '@/db/schema'
import { Trash2 } from 'lucide-vue-next'
import { ref } from 'vue'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface Props {
  open?: boolean
  tasks: Task[]
  showTrigger?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}

const props = withDefaults(defineProps<Props>(), {
  showTrigger: true
})

const emit = defineEmits<Emits>()

const isDeleting = ref(false)

const handleDelete = async () => {
  isDeleting.value = true
  
  try {
    // Remplacez ceci par votre vraie logique de suppression
    await deleteTasks(props.tasks.map(task => task.id))
    
    emit('success')
    emit('update:open', false)
  } catch (error) {
    console.error('Error deleting tasks:', error)
  } finally {
    isDeleting.value = false
  }
}

// Fonction utilitaire - remplacez par votre vraie implementation
const deleteTasks = async (taskIds: string[]) => {
  // Simuler un appel API
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Votre logique de suppression ici
  console.log('Deleting tasks:', taskIds)
}
</script>
