import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { api } from '@/service/api'
import { QueryKeyProps } from '@/types/queryKeyProps'

import type { ICourse } from '../model'

interface Course {
  courseId: ICourse['id']
}

async function deleteCourse({ courseId }: Course) {
  const { data } = await api.delete(`/courses/${courseId}`)

  return data
}

export function useDeleteCourse({ queryKey }: QueryKeyProps) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCourse,
    mutationKey: ['delete-course'],
    onSuccess: () => {
      toast('Curso deletado com sucesso!')

      queryClient.invalidateQueries({ queryKey })
    },
    onError: () => {
      toast('Opss, algo deu errado!', {
        description: 'Erro ao excluir o curso.',
      })
    },
  })
}
