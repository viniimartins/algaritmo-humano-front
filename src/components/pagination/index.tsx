import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import type { Paginated } from '@/helpers/paginated'

import { Button } from '../ui/button'

interface PaginationProps {
  meta: Paginated.Meta
  onChangeParams: (params: Partial<Paginated.Params>) => void
}

export default function Pagination({ meta, onChangeParams }: PaginationProps) {
  const { pages, total, currentPage } = meta

  return (
    <div className="mt-auto flex w-full items-center justify-between px-4">
      <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
        Total de{' '}
        <span className="text-secondary-foreground px-1 font-medium">
          {total}
        </span>{' '}
        resultados
      </div>
      <div className="flex w-full items-center gap-8 lg:w-fit">
        <div className="flex w-fit items-center justify-center text-sm font-medium">
          Página {currentPage} de {pages}
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onChangeParams({ page: 1 })}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Ir para primeira página</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => onChangeParams({ page: currentPage - 1 })}
          >
            <span className="sr-only">Ir para página anterior</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => onChangeParams({ page: currentPage + 1 })}
            disabled={currentPage === pages}
          >
            <span className="sr-only">Ir para próxima página</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            disabled={currentPage === pages}
            onClick={() => onChangeParams({ page: pages })}
          >
            <span className="sr-only">Ir para última página</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
