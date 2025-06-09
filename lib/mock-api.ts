import type { Task } from '@/types/vue-data-table'

// Données simulées pour la démonstration
export const mockTasks: Task[] = [
  {
    id: 'task-1',
    code: 'T-001',
    title: 'Implement user authentication system',
    status: 'in-progress',
    priority: 'high',
    estimatedHours: 24,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'task-2',
    code: 'T-002',
    title: 'Fix responsive design issues on mobile',
    status: 'todo',
    priority: 'medium',
    estimatedHours: 8,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: 'task-3',
    code: 'T-003',
    title: 'Add dark mode support',
    status: 'done',
    priority: 'low',
    estimatedHours: 12,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 'task-4',
    code: 'T-004',
    title: 'Optimize database queries for performance',
    status: 'in-progress',
    priority: 'high',
    estimatedHours: 16,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-19'),
  },
  {
    id: 'task-5',
    code: 'T-005',
    title: 'Create comprehensive API documentation',
    status: 'todo',
    priority: 'medium',
    estimatedHours: 20,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: 'task-6',
    code: 'T-006',
    title: 'Set up automated CI/CD pipeline',
    status: 'canceled',
    priority: 'high',
    estimatedHours: 32,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: 'task-7',
    code: 'T-007',
    title: 'Refactor legacy codebase',
    status: 'todo',
    priority: 'low',
    estimatedHours: 40,
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
  },
  {
    id: 'task-8',
    code: 'T-008',
    title: 'Add comprehensive unit tests',
    status: 'in-progress',
    priority: 'medium',
    estimatedHours: 28,
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-21'),
  },
  {
    id: 'task-9',
    code: 'T-009',
    title: 'Update third-party dependencies',
    status: 'done',
    priority: 'medium',
    estimatedHours: 4,
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'task-10',
    code: 'T-010',
    title: 'Improve error handling and logging',
    status: 'todo',
    priority: 'high',
    estimatedHours: 16,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// API functions
export const api = {
  async getTasks(page: number = 1, pageSize: number = 10, filters?: any): Promise<{
    data: Task[]
    pageCount: number
    total: number
  }> {
    await delay(500) // Simulate network delay
    
    let filteredTasks = [...mockTasks]
    
    // Apply filters if provided
    if (filters) {
      if (filters.status) {
        filteredTasks = filteredTasks.filter(task => 
          Array.isArray(filters.status) 
            ? filters.status.includes(task.status)
            : task.status === filters.status
        )
      }
      if (filters.priority) {
        filteredTasks = filteredTasks.filter(task => 
          Array.isArray(filters.priority) 
            ? filters.priority.includes(task.priority)
            : task.priority === filters.priority
        )
      }
      if (filters.title) {
        filteredTasks = filteredTasks.filter(task => 
          task.title.toLowerCase().includes(filters.title.toLowerCase())
        )
      }
    }
    
    const total = filteredTasks.length
    const pageCount = Math.ceil(total / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const data = filteredTasks.slice(startIndex, endIndex)
    
    return { data, pageCount, total }
  },

  async getTaskStatusCounts(): Promise<Record<string, number>> {
    await delay(200)
    
    const counts: Record<string, number> = {}
    mockTasks.forEach(task => {
      counts[task.status] = (counts[task.status] || 0) + 1
    })
    
    return counts
  },

  async getTaskPriorityCounts(): Promise<Record<string, number>> {
    await delay(200)
    
    const counts: Record<string, number> = {}
    mockTasks.forEach(task => {
      counts[task.priority] = (counts[task.priority] || 0) + 1
    })
    
    return counts
  },

  async getEstimatedHoursRange(): Promise<[number, number]> {
    await delay(100)
    
    const hours = mockTasks.map(task => task.estimatedHours)
    return [Math.min(...hours), Math.max(...hours)]
  },

  async createTask(taskData: Omit<Task, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    await delay(800)
    
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      code: `T-${String(mockTasks.length + 1).padStart(3, '0')}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    mockTasks.unshift(newTask)
    return newTask
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    await delay(600)
    
    const taskIndex = mockTasks.findIndex(task => task.id === id)
    if (taskIndex === -1) {
      throw new Error('Task not found')
    }
    
    const updatedTask = {
      ...mockTasks[taskIndex],
      ...updates,
      updatedAt: new Date(),
    }
    
    mockTasks[taskIndex] = updatedTask
    return updatedTask
  },

  async deleteTask(id: string): Promise<void> {
    await delay(400)
    
    const taskIndex = mockTasks.findIndex(task => task.id === id)
    if (taskIndex === -1) {
      throw new Error('Task not found')
    }
    
    mockTasks.splice(taskIndex, 1)
  },

  async deleteTasks(ids: string[]): Promise<void> {
    await delay(600)
    
    ids.forEach(id => {
      const taskIndex = mockTasks.findIndex(task => task.id === id)
      if (taskIndex !== -1) {
        mockTasks.splice(taskIndex, 1)
      }
    })
  },
}
