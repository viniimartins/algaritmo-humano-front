/* eslint-disable @next/next/no-img-element */
'use client'

import { format } from 'date-fns'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useState } from 'react'

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
import { Badge } from '@/components/ui/badge'
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
import { ScrollArea } from '@/components/ui/scroll-area'
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
import { useDeleteCourse } from '@/modules/courses/mutations/delete-course'
import { useGetCoursesByUser } from '@/modules/courses/query/get-courses-by-user'
import { formatDuration } from '@/utils/formatDuration'
import { courseStatus } from '@/utils/status'

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

  const {
    data: courses,
    queryKey,
    isFetching,
  } = useGetCoursesByUser({ page, limit })

  const { mutateAsync: deleteCourse } = useDeleteCourse({ queryKey })

  const handleDeleteCourse = (id: string) => {
    deleteCourse({ courseId: id })

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

        <Link href="/">
          <Button variant="outline" className="hover:cursor-pointer">
            Listar todos os cursos disponíveis
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {courses?.data.length === 0 && (
          <p className="text-2xl">
            Nenhum{' '}
            <span className="text-muted-foreground font-semibold">curso</span>{' '}
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
            const {
              id,
              title,
              status,
              image,
              duration,
              description,
              createdAt,
            } = course

            const { variant, statusName } = courseStatus(status)

            return (
              <Card key={id} className="flex h-[40rem] w-full flex-col">
                <CardHeader className="flex justify-between">
                  <CardTitle className="truncate text-xl">{title}</CardTitle>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:cursor-pointer"
                        aria-label="Open menu"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => actionsModalCourse.open(course)}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => actionsAlertDialogCourse.open(course)}
                      >
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-2">
                  <div className="relative h-64 w-full overflow-hidden rounded-t-md">
                    <img
                      src={image}
                      alt={`Image ${title}`}
                      className="h-full w-full"
                      loading="lazy"
                    />
                  </div>

                  <ScrollArea className="text-muted-foreground line-clamp-3 max-h-[14rem] min-h-[4rem] overflow-auto px-2">
                    {description}
                  </ScrollArea>
                </CardContent>

                <CardFooter className="mt-auto flex items-center justify-between">
                  <div className="flex gap-2">
                    <time className="text-xs font-medium">
                      {format(createdAt, 'dd/MM/yyyy')}
                    </time>

                    <time className="text-xs font-medium">
                      {formatDuration(duration)}
                    </time>
                  </div>

                  <Badge className="h-8" variant={variant}>
                    {statusName}
                  </Badge>
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
              o curso e todos os dados associados a ele.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={actionsAlertDialogCourse.close}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                handleDeleteCourse(toDeleteAlertDialogCourse?.id ?? '')
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
