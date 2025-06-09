<template>
  <Sheet :open="open" @update:open="$emit('update:open', $event)">
    <SheetTrigger v-if="showTrigger" as-child>
      <Button variant="outline">
        <Pencil class="mr-2 h-4 w-4" />
        Edit Task
      </Button>
    </SheetTrigger>
    
    <SheetContent class="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>{{ task ? 'Edit Task' : 'Create Task' }}</SheetTitle>
        <SheetDescription>
          {{ task ? 'Make changes to the task here.' : 'Create a new task here.' }}
          Click save when you're done.
        </SheetDescription>
      </SheetHeader>
      
      <form @submit.prevent="handleSubmit" class="space-y-4 py-4">
        <div class="space-y-2">
          <label for="title" class="text-sm font-medium">Title</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            placeholder="Task title"
            required
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        
        <div class="space-y-2">
          <label for="status" class="text-sm font-medium">Status</label>
          <select
            id="status"
            v-model="formData.status"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
        
        <div class="space-y-2">
          <label for="priority" class="text-sm font-medium">Priority</label>
          <select
            id="priority"
            v-model="formData.priority"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div class="space-y-2">
          <label for="estimatedHours" class="text-sm font-medium">Estimated Hours</label>
          <input
            id="estimatedHours"
            v-model.number="formData.estimatedHours"
            type="number"
            min="0"
            step="0.5"
            placeholder="0"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        
        <SheetFooter>
          <Button 
            type="submit" 
            :disabled="isSaving"
            class="w-full"
          >
            <template v-if="isSaving">
              <div class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Saving...
            </template>
            <template v-else>
              {{ task ? 'Save Changes' : 'Create Task' }}
            </template>
          </Button>
        </SheetFooter>
      </form>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import type { Task } from '@/db/schema'
import { Pencil } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface Props {
  open?: boolean
  task?: Task | null
  showTrigger?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'success', task: Task): void
}

const props = withDefaults(defineProps<Props>(), {
  showTrigger: true
})

const emit = defineEmits<Emits>()

const isSaving = ref(false)

const formData = ref({
  title: '',
  status: 'todo' as Task['status'],
  priority: 'medium' as Task['priority'],
  estimatedHours: 0
})

// Réinitialiser le formulaire quand la tâche change
watch(() => props.task, (newTask) => {
  if (newTask) {
    formData.value = {
      title: newTask.title || '',
      status: newTask.status || 'todo',
      priority: newTask.priority || 'medium',
      estimatedHours: newTask.estimatedHours || 0
    }
  } else {
    formData.value = {
      title: '',
      status: 'todo',
      priority: 'medium',
      estimatedHours: 0
    }
  }
}, { immediate: true })

const handleSubmit = async () => {
  isSaving.value = true
  
  try {
    if (props.task) {
      // Modifier une tâche existante
      const updatedTask = await updateTask(props.task.id, formData.value)
      emit('success', updatedTask)
    } else {
      // Créer une nouvelle tâche
      const newTask = await createTask(formData.value)
      emit('success', newTask)
    }
    
    emit('update:open', false)
  } catch (error) {
    console.error('Error saving task:', error)
  } finally {
    isSaving.value = false
  }
}

// Fonctions utilitaires - remplacez par vos vraies implementations
const updateTask = async (id: string, data: Partial<Task>): Promise<Task> => {
  // Simuler un appel API
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Votre logique de mise à jour ici
  console.log('Updating task:', id, data)
  return { ...props.task!, ...data } as Task
}

const createTask = async (data: Partial<Task>): Promise<Task> => {
  // Simuler un appel API
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Votre logique de création ici
  console.log('Creating task:', data)
  return {
    id: Date.now().toString(),
    code: `T-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data
  } as Task
}
</script>
