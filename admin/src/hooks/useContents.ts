import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { Content, ContentStatus } from '@/types/content'

// ─── Query Keys ───
export const contentKeys = {
  all: ['contents'] as const,
  byStatus: (status: ContentStatus) => ['contents', status] as const,
  detail: (id: string) => ['contents', id] as const,
}

// ─── Queries ───
export function useContents() {
  return useQuery({
    queryKey: contentKeys.all,
    queryFn: async () => {
      const { data } = await api.get<Content[]>('/instagram/contents')
      return data
    },
  })
}

export function useContentsByStatus(status: ContentStatus) {
  return useQuery({
    queryKey: contentKeys.byStatus(status),
    queryFn: async () => {
      const { data } = await api.get<Content[]>(`/instagram/contents/status?value=${status}`)
      return data
    },
  })
}

export function useContent(id: string) {
  return useQuery({
    queryKey: contentKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get<Content>(`/instagram/contents/${id}`)
      return data
    },
    enabled: !!id,
  })
}

// ─── Mutations ───
export function useApproveContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.put<Content>(`/instagram/contents/${id}/approve`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all })
    },
  })
}

export function useRejectContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data } = await api.put<Content>(`/instagram/contents/${id}/reject`, {
        rejectionReason: reason,
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all })
    },
  })
}

export function usePublishContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.put<Content>(`/instagram/contents/${id}/publish`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all })
    },
  })
}

export function useDeleteContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<Content>(`/instagram/contents/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all })
    },
  })
}

export function useGenerateContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<Content>('/instagram/contents/generate')
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all })
    },
  })
}