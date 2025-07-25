import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { WithoutEntityBaseProperties } from '@/helpers/without-entity-base-properties'
import { api } from '@/service/api'
import { QueryKeyProps } from '@/types/queryKeyProps'

import type { ICourse } from '../model'

export interface UpdateCourse {
  course: WithoutEntityBaseProperties<ICourse>
  id: ICourse['id']
}

async function update({ course, id }: UpdateCourse) {
  console.log(course, id)

  const { data } = await api.put(`/courses/${id}`, {
    ...course,
  })

  return data
}

export function useUpdateCourse({ queryKey }: QueryKeyProps) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: update,
    mutationKey: ['update-course'],
    onSuccess: () => {
      toast('Curso editado com sucesso!')

      queryClient.invalidateQueries({ queryKey })
    },
    onError: () => {
      toast('Opss, algo deu errado!', {
        description: 'Erro ao editar o curso.',
      })
    },
  })
}
