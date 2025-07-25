import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { WithoutEntityBaseProperties } from '@/helpers/without-entity-base-properties'
import { api } from '@/service/api'
import { QueryKeyProps } from '@/types/queryKeyProps'

import type { ICourse } from '../model'

export interface CreateCourse {
  course: WithoutEntityBaseProperties<ICourse>
  id: ICourse['id']
}

async function create({ course }: CreateCourse) {
  const { data } = await api.post('/courses', {
    ...course,
  })

  return data
}

export function useUpdateCourse({ queryKey }: QueryKeyProps) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create,
    mutationKey: ['update-course'],
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onError: () => {
      toast('Opss, algo deu errado!', {
        description: 'Erro ao editar o curso.',
      })
    },
  })
}
