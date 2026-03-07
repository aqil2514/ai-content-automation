import { Button } from '@/components/ui/button'
import { LayoutGridIcon, TableIcon } from 'lucide-react'

export type ViewMode = 'grid' | 'table'

interface Props {
  value: ViewMode
  onChange: (value: ViewMode) => void
}

export function ViewToggle({ value, onChange }: Props) {
  return (
    <div className="flex items-center border rounded-md">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange('grid')}
        className={value === 'grid' ? 'bg-muted' : ''}
      >
        <LayoutGridIcon className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange('table')}
        className={value === 'table' ? 'bg-muted' : ''}
      >
        <TableIcon className="w-4 h-4" />
      </Button>
    </div>
  )
}