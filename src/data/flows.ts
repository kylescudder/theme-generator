import type { Flow } from '@/models/Flow'
import { ChevronRight, MoreHorizontal } from 'lucide-react'

export const mockFlows: Flow[] = [
  {
    id: 'f-1',
    title: '[AG] Info Label',
    initial: 'A',
    dateTime: '12/02/25 • 10:57'
  },
  {
    id: 'f-2',
    title: '[AG] Info Label',
    initial: 'A',
    dateTime: '12/02/25 • 10:54'
  },
  {
    id: 'f-3',
    title: '[AG] Info Label',
    initial: 'A',
    dateTime: '12/02/25 • 10:53'
  },
  {
    id: 'f-4',
    title: '[AG] Info Label',
    initial: 'A',
    dateTime: '22/11/25 • 15:07'
  },
  {
    id: 'f-5',
    title: '[AG] Info Label',
    initial: 'A',
    dateTime: '22/11/25 • 15:05'
  }
]

export const currentFlow: Flow = {
  id: 'f-current',
  title: '[AG] Info Label',
  initial: 'K',
  dateTime: '12/02/25 • 10:57',
  breadcrumb: [
    'Customers',
    ChevronRight,
    MoreHorizontal,
    ChevronRight,
    'AA. Heathervale House',
    ChevronRight,
    'CTUK_AA_1'
  ]
}
