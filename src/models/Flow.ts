import type { ElementType } from 'react'

export interface Flow {
  id: string
  title: string
  initial: string
  dateTime: string
  breadcrumb?: (string | ElementType)[]
}
