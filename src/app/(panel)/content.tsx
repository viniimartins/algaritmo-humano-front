'use client'

import { format } from 'date-fns'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import Pagination from '@/components/pagination'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import type { Paginated } from '@/helpers/paginated'
import { useModal } from '@/hooks/use-modal'
import type { ICourse } from '@/modules/courses/model'
import { useDeleteCourse } from '@/modules/courses/mutations/delete'
import { useGetCourses } from '@/modules/courses/query/get'

import { FormContainer } from './form'

export function Content() {
  const {
    isOpen: isOpenModalCourse,
    actions: actionsModalCourse,
    target: toUpdateModalCourse,
  } = useModal<ICourse>()

  const {
    isOpen: isOpenAlertDialogCourse,
    actions: actionsAlertDialogCourse,
    target: toDeleteAlertDialogCourse,
  } = useModal<ICourse>()

  const [cousePaginationParams, setCousePaginationParams] =
    useState<Paginated.Params>({
      page: 1,
      limit: 10,
    })

  const { page, limit } = cousePaginationParams

  const { data: courses, queryKey, isFetching } = useGetCourses({ page, limit })

  const { mutateAsync: deleteCourse } = useDeleteCourse({ queryKey })

  const handleDeleteTask = (id: string) => {
    deleteCourse(
      { courseId: id },
      {
        onSuccess: () => {
          toast('Task excluido com sucesso!', {
            description: 'O Task foi excluido à lista.',
          })
        },
      },
    )

    actionsAlertDialogCourse.close()
  }

  const onChangeCoursePaginationParams = useCallback(
    (updatedParams: Partial<Paginated.Params>) => {
      return setCousePaginationParams((state) => ({
        ...state,
        ...updatedParams,
      }))
    },
    [],
  )

  return (
    <>
      <div className="flex w-full flex-col justify-between gap-4 sm:flex-row">
        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <h1 className="text-3xl font-medium">Meus Cursos</h1>
        </div>

        <Button
          onClick={() => actionsModalCourse.open()}
          className="hover:cursor-pointer"
        >
          Adicionar Curso
        </Button>

        <Separator orientation="vertical" />

        <Link href="/courses">
          <Button
            onClick={() => actionsModalCourse.open()}
            variant="outline"
            className="hover:cursor-pointer"
          >
            Listar todos os cursos disponíveis
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {courses?.data.length === 0 && (
          <p className="text-2xl">
            Nenhum{' '}
            <span className="text-muted-foreground font-semibold">CURSO</span>{' '}
            encontrado!
          </p>
        )}

        {isFetching &&
          courses?.data.map((course) => {
            const { id } = course

            return <Skeleton key={id} className="h-96 w-full" />
          })}

        {!isFetching &&
          courses?.data.map((course) => {
            const { id, title, description, createdAt } = course

            return (
              <Card key={id} className="h-96 w-full">
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle className="truncate text-xl">{title}</CardTitle>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-[2rem] w-[2rem] p-0 hover:cursor-pointer"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-[1rem] w-[1rem]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => actionsModalCourse.open(course)}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => actionsModalCourse.open(course)}
                      >
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-8 overflow-auto text-base">
                    {description}
                  </p>
                </CardContent>
                <CardFooter className="m-0 mt-auto flex items-end justify-between">
                  <time className="text-xs font-medium">
                    {format(createdAt, 'dd/MM/yyyy')}
                  </time>
                </CardFooter>
              </Card>
            )
          })}
      </div>

      {courses && (
        <Pagination
          meta={{
            pages: courses?.pages,
            total: courses?.total,
            currentPage: page,
          }}
          onChangeParams={onChangeCoursePaginationParams}
        />
      )}

      <Sheet open={isOpenModalCourse} onOpenChange={actionsModalCourse.close}>
        <SheetContent className="!max-w-lg">
          <SheetHeader>
            <SheetTitle>Adicionar Curso</SheetTitle>
            <SheetDescription>Preencha os detalhes do curso.</SheetDescription>
          </SheetHeader>
          <FormContainer
            toUpdateModalCourse={toUpdateModalCourse}
            queryKey={queryKey}
            actionsModalCourse={actionsModalCourse}
          />
        </SheetContent>
      </Sheet>

      <AlertDialog open={isOpenAlertDialogCourse}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Deseja realmente deletar esta Curso?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá remover permanentemente
              a Task e todos os dados associados a ele.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={actionsAlertDialogCourse.close}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                handleDeleteTask(toDeleteAlertDialogCourse?.id ?? '')
              }
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
