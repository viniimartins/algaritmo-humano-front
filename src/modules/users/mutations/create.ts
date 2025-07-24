import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { api } from '@/service/api'
import type { Account } from '@/modules/users/model'

export interface CreateAccount {
  account: Account
}

async function create({ account }: CreateAccount) {
  const { data } = await api.post('/register', {
    ...account,
  })

  return data
}

export function useCreateAccount() {
  return useMutation({
    mutationFn: create,
    mutationKey: ['create-account'],
    onError: () => {
      toast('Opss, algo deu errado!', {
        description: 'Erro ao registrar usuario.',
      })
    },
  })
}
