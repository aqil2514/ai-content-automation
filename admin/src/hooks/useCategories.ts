import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { Category } from '@/types/content'

export const categoryKeys = {
  all: ['categories'] as const,
  active: ['categories', 'active'] as const,
}

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: async () => {
      const { data } = await api.get<Category[]>('/instagram/categories')
      return data
    },
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: Pick<Category, 'name' | 'description' | 'isActive'>) => {
      const { data } = await api.post<Category>('/instagram/categories', body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: Partial<Pick<Category, 'name' | 'description' | 'isActive'>> }) => {
      const { data } = await api.put<Category>(`/instagram/categories/${id}`, body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<Category>(`/instagram/categories/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
    },
  })
}