"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  useTopics,
  useGenerateTopics,
  useDeleteTopic,
} from "@/hooks/useTopics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2Icon, SparklesIcon, RefreshCwIcon } from "lucide-react";

type UsedFilter = "all" | "used" | "unused";

export default function TopicsTemplate() {
  const [usedFilter, setUsedFilter] = useState<UsedFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // ─── Queries ───
  const { data: topics = [], isLoading, refetch } = useTopics();
  const { mutate: generate, isPending: isGenerating } = useGenerateTopics();
  const { mutate: remove } = useDeleteTopic();

  // ─── Categories list dari data topics ───
  const categories = useMemo(() => {
    const map = new Map<string, string>();
    topics.forEach((t) => {
      if (t.category?._id) {
        map.set(t.category._id, t.category.name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [topics]);

  // ─── Filtered ───
  const filtered = useMemo(() => {
    return topics.filter((t) => {
      const matchUsed =
        usedFilter === "all"
          ? true
          : usedFilter === "used"
            ? t.isUsed
            : !t.isUsed;

      const matchCategory =
        categoryFilter === "all" ? true : t.category?._id === categoryFilter;

      return matchUsed && matchCategory;
    });
  }, [topics, usedFilter, categoryFilter]);

  // ─── Handlers ───
  function handleGenerate() {
    generate(undefined, {
      onSuccess: () => toast.success("Topics generated successfully"),
      onError: () => toast.error("Failed to generate topics"),
    });
  }

  function handleDelete(id: string) {
    remove(id, {
      onSuccess: () => toast.success("Topic deleted"),
      onError: () => toast.error("Failed to delete topic"),
    });
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-6 p-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            {/* Filter used/unused */}
            <Select
              value={usedFilter}
              onValueChange={(v) => setUsedFilter(v as UsedFilter)}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unused">Unused</SelectItem>
                <SelectItem value="used">Used</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter by category */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="text-sm text-muted-foreground">
              {filtered.length} topics
            </span>
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
            <Button size="sm" onClick={handleGenerate} disabled={isGenerating}>
              <SparklesIcon className="w-4 h-4 mr-1" />
              {isGenerating ? "Generating..." : "Generate Topics"}
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-muted-foreground"
                  >
                    Loading topics...
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No topics found
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                filtered.map((topic) => (
                  <TableRow key={topic._id}>
                    <TableCell className="max-w-sm">
                      <p className="text-sm truncate">{topic.title}</p>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm text-muted-foreground">
                        {topic.category?.name ?? "—"}
                      </p>
                    </TableCell>

                    <TableCell>
                      {topic.isUsed ? (
                        <Badge
                          variant="outline"
                          className="bg-violet-500/10 text-violet-500 border-violet-500/20"
                        >
                          Used
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        >
                          Unused
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(topic.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(topic._id)}
                        className="text-rose-500 hover:text-rose-500 hover:bg-rose-500/10"
                      >
                        <Trash2Icon className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
