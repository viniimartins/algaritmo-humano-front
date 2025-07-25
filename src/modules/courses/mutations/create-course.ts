import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { WithoutEntityBaseProperties } from '@/helpers/without-entity-base-properties'
import { api } from '@/service/api'
import { QueryKeyProps } from '@/types/queryKeyProps'

import type { ICourse } from '../model'

export interface CreateCourse {
  course: WithoutEntityBaseProperties<ICourse>
}

async function create({ course }: CreateCourse) {
  const { data } = await api.post('/courses', {
    ...course,
  })

  return data
}

export function useCreateCourse({ queryKey }: QueryKeyProps) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: create,
    mutationKey: ['create-course'],
    onSuccess: () => {
      toast('Curso criado com sucesso!')

      queryClient.invalidateQueries({ queryKey })
    },
    onError: () => {
      toast('Opss, algo deu errado!', {
        description: 'Erro ao criar o curso.',
      })
    },
  })
}
