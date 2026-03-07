import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContentStatusBadge } from "./ContentStatusBadge";
import { Content } from "@/types/content";
import { CheckIcon, XIcon, SendIcon, ExternalLinkIcon } from "lucide-react";

interface Props {
  content: Content | null;
  open: boolean;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onPublish?: (id: string) => void;
}

export function ContentDetailDialog({
  content,
  open,
  onClose,
  onApprove,
  onReject,
  onPublish,
}: Props) {
  if (!content) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Content Detail</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Kiri — Image */}
          <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted">
            {content.imageUrl ? (
              <Image
                src={content.imageUrl}
                alt={content.topic?.topic ?? "Content image"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                No image
              </div>
            )}
          </div>

          {/* Kanan — Detail */}
          <div className="flex flex-col gap-4 overflow-y-auto">
            {/* Status & Date */}
            <div className="flex items-center justify-between">
              <ContentStatusBadge status={content.status} />
              <span className="text-xs text-muted-foreground">
                {new Date(content.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Topic */}
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Topic
              </p>
              <p className="text-sm font-medium">{content.topic.topic}</p>
              <p className="text-xs text-muted-foreground">
                {content.topic.category?.name}
              </p>
            </div>

            {/* Caption */}
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Caption
              </p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {content.caption}
              </p>
            </div>

            {/* Rejection Reason */}
            {content.rejectionReason && (
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <p className="text-xs font-semibold text-rose-500 uppercase tracking-wide">
                  Rejection Reason
                </p>
                <p className="text-sm text-rose-400">
                  {content.rejectionReason}
                </p>
              </div>
            )}

            {/* Instagram URL */}
            {content.instagramPostUrl && (
              <a
                href={content.instagramPostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-violet-500 hover:underline"
              >
                <ExternalLinkIcon className="w-4 h-4" />
                View on Instagram
              </a>
            )}
          </div>
        </div>

        <DialogFooter className="flex-wrap gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          {content.status === "pending" && (
            <>
              <Button
                variant="outline"
                onClick={() => onApprove?.(content._id)}
                className="text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10"
              >
                <CheckIcon className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                variant="outline"
                onClick={() => onReject?.(content._id)}
                className="text-rose-500 border-rose-500/20 hover:bg-rose-500/10"
              >
                <XIcon className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </>
          )}

          {content.status === "approved" && (
            <Button
              variant="outline"
              onClick={() => onPublish?.(content._id)}
              className="text-violet-500 border-violet-500/20 hover:bg-violet-500/10"
            >
              <SendIcon className="w-4 h-4 mr-1" />
              Publish
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
