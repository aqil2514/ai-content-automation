import { Badge } from '@/components/ui/badge'
import { ContentStatus } from '@/types/content'

interface Props {
  status: ContentStatus | string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  },
  approved: {
    label: 'Approved',
    className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  },
  published: {
    label: 'Published',
    className: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
  },
}

const fallback = {
  label: 'Unknown',
  className: 'bg-muted text-muted-foreground border-border',
}

export function ContentStatusBadge({ status }: Props) {
  const config = statusConfig[status?.toLowerCase()] ?? fallback

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}