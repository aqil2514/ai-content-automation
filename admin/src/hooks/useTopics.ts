import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { Topic } from '@/types/content'

export const topicKeys = {
  all: ['topics'] as const,
  unused: ['topics', 'unused'] as const,
}

export function useTopics() {
  return useQuery({
    queryKey: topicKeys.all,
    queryFn: async () => {
      const { data } = await api.get<Topic[]>('/instagram/topics')
      return data
    },
  })
}

export function useGenerateTopics() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/instagram/topics/generate')
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: topicKeys.all })
    },
  })
}

export function useDeleteTopic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/instagram/topics/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: topicKeys.all })
    },
  })
}