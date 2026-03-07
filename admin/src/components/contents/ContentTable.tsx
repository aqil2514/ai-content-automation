import Image from 'next/image'
import { Content } from '@/types/content'
import { ContentStatusBadge } from './ContentStatusBadge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  CheckIcon,
  XIcon,
  SendIcon,
  Trash2Icon,
  ExternalLinkIcon,
} from 'lucide-react'

interface Props {
  contents: Content[]
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onPublish?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
}

export function ContentTable({
  contents,
  onApprove,
  onReject,
  onPublish,
  onDelete,
  onView,
}: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Image</TableHead>
          <TableHead>Topic</TableHead>
          <TableHead>Caption</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contents.map((content) => (
          <TableRow key={content._id}>

            {/* Image */}
            <TableCell>
              <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted shrink-0">
                {content.imageUrl ? (
                  <Image
                    src={content.imageUrl}
                    alt={content.topic?.topic ?? "Content Image"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    —
                  </div>
                )}
              </div>
            </TableCell>

            {/* Topic */}
            <TableCell>
              <p className="text-sm font-medium max-w-40 truncate">
                {content.topic.topic}
              </p>
              <p className="text-xs text-muted-foreground">
                {content.topic.category?.name}
              </p>
            </TableCell>

            {/* Caption */}
            <TableCell>
              <p className="text-sm text-muted-foreground max-w-70 truncate">
                {content.caption}
              </p>
            </TableCell>

            {/* Status */}
            <TableCell>
              <ContentStatusBadge status={content.status} />
            </TableCell>

            {/* Created */}
            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
              {new Date(content.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </TableCell>

            {/* Actions */}
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">

                <Button variant="ghost" size="icon" onClick={() => onView?.(content._id)}>
                  <ExternalLinkIcon className="w-4 h-4" />
                </Button>

                {content.status === 'pending' && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onApprove?.(content._id)}
                      className="text-emerald-500 hover:text-emerald-500 hover:bg-emerald-500/10"
                    >
                      <CheckIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onReject?.(content._id)}
                      className="text-rose-500 hover:text-rose-500 hover:bg-rose-500/10"
                    >
                      <XIcon className="w-4 h-4" />
                    </Button>
                  </>
                )}

                {content.status === 'approved' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onPublish?.(content._id)}
                    className="text-violet-500 hover:text-violet-500 hover:bg-violet-500/10"
                  >
                    <SendIcon className="w-4 h-4" />
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete?.(content._id)}
                  className="text-rose-500 hover:text-rose-500 hover:bg-rose-500/10"
                >
                  <Trash2Icon className="w-4 h-4" />
                </Button>

              </div>
            </TableCell>

          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}