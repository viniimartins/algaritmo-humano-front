/* eslint-disable @next/next/no-img-element */
'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import { useCallback, useState } from 'react'

import Pagination from '@/components/pagination'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import type { Paginated } from '@/helpers/paginated'
import { useGetCourses } from '@/modules/courses/query/get-courses'
import { formatDuration } from '@/utils/formatDuration'

export function Content() {
  const [cousePaginationParams, setCousePaginationParams] =
    useState<Paginated.Params>({
      page: 1,
      limit: 10,
    })

  const { page, limit } = cousePaginationParams

  const { data: courses, isFetching } = useGetCourses({
    page,
    limit,
    filters: ['status,ACTIVE'],
  })

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
          <h1 className="text-3xl font-medium">Cursos Dísponiveis</h1>
        </div>

        <Link href="/meus-cursos">
          <Button variant="outline" className="hover:cursor-pointer">
            Listar meus cursos
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
            const { id, title, image, duration, description, createdAt } =
              course

            return (
              <Card key={id} className="flex h-[40rem] w-full flex-col">
                <CardHeader className="flex justify-between">
                  <CardTitle className="truncate text-xl">{title}</CardTitle>
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
                  <time className="text-xs font-medium">
                    {format(createdAt, 'dd/MM/yyyy')}
                  </time>

                  <time className="text-xs font-medium">
                    {formatDuration(duration)}
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
    </>
  )
}
