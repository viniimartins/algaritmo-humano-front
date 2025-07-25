import { Metadata } from 'next'
import Link from 'next/link'

import { FormLogin } from './form'

export const metadata: Metadata = {
  title: 'Criar Conta',
}

export default function NewAccount() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-center text-3xl font-bold">Criar Conta</h1>
        <span className="text-muted-foreground text-sm">
          Crie sua conta para começar a cadastrar e gerenciar seus cursos com
          facilidade
        </span>
      </div>
      <div className="mx-auto w-full max-w-md">
        <FormLogin />
        <div className="mt-4 text-center text-sm">
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </div>
    </>
  )
}
