export interface SectionItem {
  title: string
  required?: boolean
}

export interface Section {
  title: string
  completeText: string
  completedCount: string
  sections: SectionItem[]
}
