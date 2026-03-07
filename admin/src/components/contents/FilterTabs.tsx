import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContentStatus } from '@/types/content'

export type FilterValue = ContentStatus | 'all'

const filters: { label: string; value: FilterValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Published', value: 'published' },
]

interface Props {
  value: FilterValue
  onChange: (value: FilterValue) => void
}

export function FilterTabs({ value, onChange }: Props) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as FilterValue)}>
      <TabsList>
        {filters.map((filter) => (
          <TabsTrigger key={filter.value} value={filter.value}>
            {filter.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}