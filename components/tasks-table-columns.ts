import type { ColumnDef } from '@tanstack/vue-table'
import type { Task } from '@/db/schema'
import type { DataTableRowAction } from '@/types/data-table'
import { h } from 'vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown 
} from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface GetTasksTableColumnsOptions {
  statusCounts: Record<string, number>
  priorityCounts: Record<string, number>
  estimatedHoursRange: [number, number]
  setRowAction: (action: DataTableRowAction<Task>) => void
}

export function getTasksTableColumns(options: GetTasksTableColumnsOptions): ColumnDef<Task>[] {
  const { statusCounts, priorityCounts, estimatedHoursRange, setRowAction } = options

  return [
    // Selection column
    {
      id: 'select',
      header: ({ table }) => h(Checkbox, {
        checked: table.getIsAllPageRowsSelected(),
        'onUpdate:checked': (value: boolean) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all'
      }),
      cell: ({ row }) => h(Checkbox, {
        checked: row.getIsSelected(),
        'onUpdate:checked': (value: boolean) => row.toggleSelected(!!value),
        ariaLabel: 'Select row'
      }),
      enableSorting: false,
      enableHiding: false,
    },

    // Code column
    {
      accessorKey: 'code',
      header: ({ column }) => h(Button, {
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        class: '-ml-3 h-8 data-[state=open]:bg-accent'
      }, () => [
        'Code',
        column.getIsSorted() === 'desc' 
          ? h(ArrowDown, { class: 'ml-2 h-4 w-4' })
          : column.getIsSorted() === 'asc'
          ? h(ArrowUp, { class: 'ml-2 h-4 w-4' })
          : h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })
      ]),
      cell: ({ getValue }) => {
        const value = getValue() as string
        return h('div', { class: 'w-20' }, value)
      },
      meta: {
        label: 'Code',
        variant: 'text'
      }
    },

    // Title column
    {
      accessorKey: 'title',
      header: ({ column }) => h(Button, {
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        class: '-ml-3 h-8 data-[state=open]:bg-accent'
      }, () => [
        'Title',
        column.getIsSorted() === 'desc' 
          ? h(ArrowDown, { class: 'ml-2 h-4 w-4' })
          : column.getIsSorted() === 'asc'
          ? h(ArrowUp, { class: 'ml-2 h-4 w-4' })
          : h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })
      ]),
      cell: ({ getValue }) => {
        const value = getValue() as string
        return h('div', { class: 'max-w-[31.25rem] truncate font-medium' }, value)
      },
      meta: {
        label: "Title",
        placeholder: "Search titles...",
        variant: "text",
        icon: Text,
      },
      enableColumnFilter: true
    },

    // Status column
    {
      accessorKey: 'status',
      header: ({ column }) => h(Button, {
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        class: '-ml-3 h-8 data-[state=open]:bg-accent'
      }, () => [
        'Status',
        column.getIsSorted() === 'desc' 
          ? h(ArrowDown, { class: 'ml-2 h-4 w-4' })
          : column.getIsSorted() === 'asc'
          ? h(ArrowUp, { class: 'ml-2 h-4 w-4' })
          : h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })
      ]),
      cell: ({ getValue }) => {
        const value = getValue() as string
        const variant = getStatusVariant(value)
        return h(Badge, { variant }, () => value)
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      meta: {
        label: 'Status',
        variant: 'multi-select',
        options: Object.entries(statusCounts).map(([value, count]) => ({
          label: value,
          value,
          count
        }))
      }
    },

    // Priority column
    {
      accessorKey: 'priority',
      header: ({ column }) => h(Button, {
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        class: '-ml-3 h-8 data-[state=open]:bg-accent'
      }, () => [
        'Priority',
        column.getIsSorted() === 'desc' 
          ? h(ArrowDown, { class: 'ml-2 h-4 w-4' })
          : column.getIsSorted() === 'asc'
          ? h(ArrowUp, { class: 'ml-2 h-4 w-4' })
          : h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })
      ]),
      cell: ({ getValue }) => {
        const value = getValue() as string
        const variant = getPriorityVariant(value)
        return h(Badge, { variant }, () => value)
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      meta: {
        label: 'Priority',
        variant: 'multi-select',
        options: Object.entries(priorityCounts).map(([value, count]) => ({
          label: value,
          value,
          count
        }))
      }
    },

    // Estimated Hours column
    {
      accessorKey: 'estimatedHours',
      header: ({ column }) => h(Button, {
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        class: '-ml-3 h-8 data-[state=open]:bg-accent'
      }, () => [
        'Estimated Hours',
        column.getIsSorted() === 'desc' 
          ? h(ArrowDown, { class: 'ml-2 h-4 w-4' })
          : column.getIsSorted() === 'asc'
          ? h(ArrowUp, { class: 'ml-2 h-4 w-4' })
          : h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })
      ]),
      cell: ({ getValue }) => {
        const value = getValue() as number
        return h('div', { class: 'w-20' }, value?.toString() ?? 'N/A')
      },
      filterFn: (row, id, value) => {
        const rowValue = row.getValue(id) as number
        const [min, max] = value as [number, number]
        return rowValue >= min && rowValue <= max
      },
      meta: {
        label: 'Estimated Hours',
        variant: 'range',
        options: {
          min: estimatedHoursRange[0],
          max: estimatedHoursRange[1]
        }
      }
    },

    // Created At column
    {
      accessorKey: 'createdAt',
      header: ({ column }) => h(Button, {
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        class: '-ml-3 h-8 data-[state=open]:bg-accent'
      }, () => [
        'Created At',
        column.getIsSorted() === 'desc' 
          ? h(ArrowDown, { class: 'ml-2 h-4 w-4' })
          : column.getIsSorted() === 'asc'
          ? h(ArrowUp, { class: 'ml-2 h-4 w-4' })
          : h(ChevronsUpDown, { class: 'ml-2 h-4 w-4' })
      ]),
      cell: ({ getValue }) => {
        const value = getValue() as Date
        return h('div', { class: 'w-40' }, value?.toLocaleDateString() ?? 'N/A')
      },
      meta: {
        label: 'Created At',
        variant: 'date'
      }
    },

    // Actions column
    {
      id: 'actions',
      cell: ({ row }) => {
        const task = row.original

        return h(DropdownMenu, null, {
          default: () => [
            h(DropdownMenuTrigger, { asChild: true }, () =>
              h(Button, {
                'aria-haspopup': 'true',
                size: 'icon',
                variant: 'ghost',
                class: 'flex size-8 p-0 data-[state=open]:bg-muted'
              }, () => [
                h(MoreHorizontal, { class: 'size-4' }),
                h('span', { class: 'sr-only' }, 'Open menu')
              ])
            ),
            h(DropdownMenuContent, { align: 'end', class: 'w-40' }, () => [
              h(DropdownMenuItem, {
                onSelect: () => setRowAction({ variant: 'update', row })
              }, () => [
                h(Pencil, { class: 'mr-2 size-4' }),
                'Edit'
              ]),
              h(DropdownMenuSeparator),
              h(DropdownMenuItem, {
                onSelect: () => setRowAction({ variant: 'delete', row })
              }, () => [
                h(Trash2, { class: 'mr-2 size-4' }),
                'Delete'
              ])
            ])
          ]
        })
      }
    }
  ]
}

function getStatusVariant(status: string) {
  switch (status.toLowerCase()) {
    case 'todo':
      return 'secondary'
    case 'in-progress':
      return 'default'
    case 'done':
      return 'outline'
    case 'canceled':
      return 'destructive'
    default:
      return 'secondary'
  }
}

function getPriorityVariant(priority: string) {
  switch (priority.toLowerCase()) {
    case 'low':
      return 'secondary'
    case 'medium':
      return 'default'
    case 'high':
      return 'destructive'
    default:
      return 'secondary'
  }
}
