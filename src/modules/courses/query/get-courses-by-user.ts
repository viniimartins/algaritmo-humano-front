import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'

import type { Paginated } from '@/helpers/paginated'
import { api } from '@/service/api'
import { ProductMock } from '@/shared/mock/course'

import type { ICourse } from '../model'

async function get(params: Paginated.Params) {
  const { data } = await api.get<Paginated.Response<ICourse>>('/courses/me', {
    params,
  })

  return data
}

export function useGetCoursesByUser(params: Paginated.Params) {
  const queryKey = ['get-courses', params]

  const query = useQuery({
    queryKey,
    queryFn: () => get(params),
    placeholderData: ProductMock,
  })

  const { isError } = query

  useEffect(() => {
    if (isError) {
      toast('Opss, algo deu errado!', {
        description:
          'o foi possível buscar os cursos do usuário. Tente novamente',
      })
    }
  }, [isError])

  return { ...query, queryKey }
}
