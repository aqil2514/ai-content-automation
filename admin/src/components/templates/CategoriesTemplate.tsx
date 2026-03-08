'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/useCategories'
import { Category } from '@/types/content'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { PlusIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { RefreshCwIcon } from 'lucide-react'

interface CategoryForm {
  name: string
  description: string
  isActive: boolean
}

const defaultForm: CategoryForm = {
  name: '',
  description: '',
  isActive: true,
}

export default function CategoriesTemplate() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Category | null>(null)
  const [form, setForm] = useState<CategoryForm>(defaultForm)

  // ─── Queries ───
  const { data: categories = [], isLoading, refetch } = useCategories()
  const { mutate: create, isPending: isCreating } = useCreateCategory()
  const { mutate: update, isPending: isUpdating } = useUpdateCategory()
  const { mutate: remove } = useDeleteCategory()

  const isPending = isCreating || isUpdating

  // ─── Handlers ───
  function handleOpen(category?: Category) {
    if (category) {
      setSelected(category)
      setForm({
        name: category.name,
        description: category.description,
        isActive: category.isActive,
      })
    } else {
      setSelected(null)
      setForm(defaultForm)
    }
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
    setSelected(null)
    setForm(defaultForm)
  }

  function handleSubmit() {
    if (!form.name.trim()) {
      toast.error('Name is required')
      return
    }

    if (selected) {
      update({ id: selected._id, body: form }, {
        onSuccess: () => {
          toast.success('Category updated')
          handleClose()
        },
        onError: () => toast.error('Failed to update category'),
      })
    } else {
      create(form, {
        onSuccess: () => {
          toast.success('Category created')
          handleClose()
        },
        onError: () => toast.error('Failed to create category'),
      })
    }
  }

  function handleDelete(id: string) {
    remove(id, {
      onSuccess: () => toast.success('Category deleted'),
      onError: () => toast.error('Failed to delete category'),
    })
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-6 p-6">

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {categories.length} categories
          </span>
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
            <Button size="sm" onClick={() => handleOpen()}>
              <PlusIcon className="w-4 h-4 mr-1" />
              New Category
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>

              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    Loading categories...
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    No categories yet
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && categories.map((category) => (
                <TableRow key={category._id}>

                  <TableCell>
                    <p className="text-sm font-medium">{category.name}</p>
                  </TableCell>

                  <TableCell className="max-w-sm">
                    <p className="text-sm text-muted-foreground truncate">
                      {category.description || '—'}
                    </p>
                  </TableCell>

                  <TableCell>
                    {category.isActive ? (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-muted text-muted-foreground">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(category.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpen(category)}
                      >
                        <Pencil1Icon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category._id)}
                        className="text-rose-500 hover:text-rose-500 hover:bg-rose-500/10"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>

                </TableRow>
              ))}

            </TableBody>
          </Table>
        </div>

      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selected ? 'Edit Category' : 'New Category'}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">

            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g. Fantasy Adventure"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe this category..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active</Label>
              <Switch
                id="isActive"
                checked={form.isActive}
                onCheckedChange={(v) => setForm({ ...form, isActive: v })}
              />
            </div>

          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>

    </div>
  )
}