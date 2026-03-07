import Image from 'next/image'
import { Content } from '@/types/content'
import { ContentStatusBadge } from './ContentStatusBadge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckIcon, XIcon, SendIcon, Trash2Icon, ExternalLinkIcon } from 'lucide-react'

interface Props {
  content: Content
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onPublish?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
}

export function ContentCard({
  content,
  onApprove,
  onReject,
  onPublish,
  onDelete,
  onView,
}: Props) {
  return (
    <Card className="overflow-hidden flex flex-col">

      {/* Image */}
      <div className="relative aspect-square bg-muted">
        {content.imageUrl ? (
          <Image
            src={content.imageUrl}
            alt={content.topic?.topic ?? "Content Image"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}
      </div>

      <CardContent className="flex-1 flex flex-col gap-2 p-4">
        {/* Topic */}
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {content.topic.topic}
        </p>

        {/* Caption */}
        <p className="text-sm text-foreground line-clamp-3">
          {content.caption}
        </p>

        {/* Status */}
        <div className="mt-auto pt-2">
          <ContentStatusBadge status={content.status} />
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 p-4 pt-0">
        {/* View */}
        <Button variant="outline" size="sm" onClick={() => onView?.(content._id)}>
          <ExternalLinkIcon className="w-3 h-3 mr-1" />
          View
        </Button>

        {/* Approve — hanya kalau pending */}
        {content.status === 'pending' && (
          <Button variant="outline" size="sm" onClick={() => onApprove?.(content._id)}
            className="text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10">
            <CheckIcon className="w-3 h-3 mr-1" />
            Approve
          </Button>
        )}

        {/* Reject — hanya kalau pending */}
        {content.status === 'pending' && (
          <Button variant="outline" size="sm" onClick={() => onReject?.(content._id)}
            className="text-rose-500 border-rose-500/20 hover:bg-rose-500/10">
            <XIcon className="w-3 h-3 mr-1" />
            Reject
          </Button>
        )}

        {/* Publish — hanya kalau approved */}
        {content.status === 'approved' && (
          <Button variant="outline" size="sm" onClick={() => onPublish?.(content._id)}
            className="text-violet-500 border-violet-500/20 hover:bg-violet-500/10">
            <SendIcon className="w-3 h-3 mr-1" />
            Publish
          </Button>
        )}

        {/* Delete */}
        <Button variant="outline" size="sm" onClick={() => onDelete?.(content._id)}
          className="text-rose-500 border-rose-500/20 hover:bg-rose-500/10 ml-auto">
          <Trash2Icon className="w-3 h-3" />
        </Button>
      </CardFooter>

    </Card>
  )
}