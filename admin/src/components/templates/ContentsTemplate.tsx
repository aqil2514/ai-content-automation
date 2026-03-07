'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { FilterTabs, FilterValue } from '@/components/contents/FilterTabs'
import { ViewToggle, ViewMode } from '@/components/contents/ViewToggle'
import { ContentCard } from '@/components/contents/ContentCard'
import { ContentTable } from '@/components/contents/ContentTable'
import { RejectDialog } from '@/components/contents/RejectDialog'
import { ContentDetailDialog } from '@/components/contents/ContentDetailDialog'
import { Content } from '@/types/content'
import {
  useContents,
  useApproveContent,
  useRejectContent,
  usePublishContent,
  useDeleteContent,
  useGenerateContent,
} from '@/hooks/useContents'
import { Button } from '@/components/ui/button'
import { RefreshCwIcon, SparklesIcon } from 'lucide-react'

export function ContentsTemplate() {
  const [filter, setFilter] = useState<FilterValue>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)
  const [rejectId, setRejectId] = useState<string | null>(null)

  // ─── Queries ───
  const { data: contents = [], isLoading, refetch } = useContents()

  // ─── Mutations ───
  const { mutate: approve } = useApproveContent()
  const { mutate: reject, isPending: isRejecting } = useRejectContent()
  const { mutate: publish } = usePublishContent()
  const { mutate: remove } = useDeleteContent()
  const { mutate: generate, isPending: isGenerating } = useGenerateContent()

  // ─── Filtered Data ───
  const filtered = filter === 'all'
    ? contents
    : contents.filter((c) => c.status === filter)

  // ─── Handlers ───
  function handleApprove(id: string) {
    approve(id, {
      onSuccess: () => toast.success('Content approved'),
      onError: () => toast.error('Failed to approve content'),
    })
  }

  function handleReject(id: string) {
    setRejectId(id)
  }

  function handleConfirmReject(reason: string) {
    if (!rejectId) return
    reject({ id: rejectId, reason }, {
      onSuccess: () => {
        toast.success('Content rejected')
        setRejectId(null)
      },
      onError: () => toast.error('Failed to reject content'),
    })
  }

  function handlePublish(id: string) {
    publish(id, {
      onSuccess: () => toast.success('Content published to Instagram'),
      onError: () => toast.error('Failed to publish content'),
    })
  }

  function handleDelete(id: string) {
    remove(id, {
      onSuccess: () => toast.success('Content deleted'),
      onError: () => toast.error('Failed to delete content'),
    })
  }

  function handleView(id: string) {
    const content = contents.find((c) => c._id === id) ?? null
    setSelectedContent(content)
  }

  function handleGenerate() {
    generate(undefined, {
      onSuccess: () => toast.success('Content generated successfully'),
      onError: () => toast.error('Failed to generate content'),
    })
  }

  return (
    <div className="flex flex-col gap-6 p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contents</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} {filter === 'all' ? 'total' : filter} contents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCwIcon className="w-4 h-4 mr-1" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            <SparklesIcon className="w-4 h-4 mr-1" />
            {isGenerating ? 'Generating...' : 'Generate Content'}
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <FilterTabs value={filter} onChange={setFilter} />
        <ViewToggle value={viewMode} onChange={setViewMode} />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-24 text-muted-foreground text-sm">
          Loading contents...
        </div>
      )}

      {/* Empty */}
      {!isLoading && filtered.length === 0 && (
        <div className="flex items-center justify-center py-24 text-muted-foreground text-sm">
          No contents found
        </div>
      )}

      {/* Grid View */}
      {!isLoading && filtered.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((content) => (
            <ContentCard
              key={content._id}
              content={content}
              onApprove={handleApprove}
              onReject={handleReject}
              onPublish={handlePublish}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      )}

      {/* Table View */}
      {!isLoading && filtered.length > 0 && viewMode === 'table' && (
        <div className="border rounded-lg overflow-hidden">
          <ContentTable
            contents={filtered}
            onApprove={handleApprove}
            onReject={handleReject}
            onPublish={handlePublish}
            onDelete={handleDelete}
            onView={handleView}
          />
        </div>
      )}

      {/* Reject Dialog */}
      <RejectDialog
        open={!!rejectId}
        onClose={() => setRejectId(null)}
        onConfirm={handleConfirmReject}
        isPending={isRejecting}
      />

      {/* Detail Dialog */}
      <ContentDetailDialog
        content={selectedContent}
        open={!!selectedContent}
        onClose={() => setSelectedContent(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onPublish={handlePublish}
      />

    </div>
  )
}