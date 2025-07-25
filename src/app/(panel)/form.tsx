import { zodResolver } from '@hookform/resolvers/zod'
import { QueryKey } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { withMask } from 'use-mask-input'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ICourse } from '@/modules/courses/model'
import { useCreateCourse } from '@/modules/courses/mutations/create'
import { useUpdateCourse } from '@/modules/courses/mutations/update'
import { CourseStatus } from '@/types/course-status'
import { ModalActions } from '@/types/modal'

interface Props {
  toUpdateModalCourse: ICourse | null
  queryKey: QueryKey
  actionsModalCourse: ModalActions<ICourse>
}

const courseSchema = z.object({
  title: z
    .string({
      required_error: 'O título do curso é obrigatório.',
    })
    .min(3, {
      message: 'O nome do curso deve ter pelo menos 3 caracteres.',
    }),
  description: z
    .string({
      required_error: 'A descrição do curso é obrigatória.',
    })
    .min(3, {
      message: 'A descrição do curso deve ter pelo menos 3 caracteres.',
    }),
  image: z
    .string({
      required_error: 'A imagem é obrigatória.',
    })
    .url({
      message: 'A imagem deve ser uma URL válida.',
    }),
  duration: z
    .string({
      required_error: 'A duração é obrigatória.',
    })
    .regex(/^\d{2}:\d{2}:\d{2}$/, {
      message: 'A duração deve estar no formato HH:MM:SS.',
    }),
  status: z.enum([CourseStatus.ACTIVE, CourseStatus.INACTIVE], {
    required_error: 'O status é obrigatório.',
  }),
})

type ICourseFormData = z.infer<typeof courseSchema>

export function FormContainer(props: Props) {
  const { toUpdateModalCourse, queryKey, actionsModalCourse } = props

  const { mutateAsync: handleCreateTask, isPending: isPendingCreateTask } =
    useCreateCourse({
      queryKey,
    })

  const { mutateAsync: handleUpdateTask, isPending: isPendingUpdateTask } =
    useUpdateCourse({
      queryKey,
    })

  const form = useForm<ICourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: toUpdateModalCourse?.title ?? '',
      description: toUpdateModalCourse?.description ?? '',
      duration: toUpdateModalCourse?.duration ?? '',
      image: toUpdateModalCourse?.image ?? '',
      status: toUpdateModalCourse?.status,
    },
  })

  const {
    formState: { isSubmitting },
    reset,
  } = form

  function onSubmit(courseData: ICourseFormData) {
    if (!toUpdateModalCourse) {
      handleCreateTask(
        { course: courseData },
        {
          onSuccess: () => {
            toast('Task criado com sucesso!', {
              description: 'O Task foi adicionado à lista.',
            })
          },
        },
      )
    }

    if (toUpdateModalCourse) {
      handleUpdateTask(
        {
          course: courseData,
          id: toUpdateModalCourse.id,
        },
        {
          onSuccess: () => {
            toast('Curso editado com sucesso!', {
              description: 'O curso foi atualiado na lista.',
            })
          },
        },
      )
    }

    actionsModalCourse.close()
    reset()
  }

  const isLoading = isPendingCreateTask || isPendingUpdateTask || isSubmitting

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-4">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome do curso" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input placeholder="Digite a descrição do curso" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite a url da imagem do curso"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite a duração do curso"
                    {...field}
                    ref={withMask('99:99:99', {
                      placeholder: '-',
                      showMaskOnHover: false,
                    })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        className="w-full"
                        placeholder="Selecione o status do curso"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={CourseStatus.ACTIVE}>Ativo</SelectItem>
                    <SelectItem value={CourseStatus.INACTIVE}>
                      Inativo
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="ml-auto w-fit">
          <Button type="submit" disabled={isLoading}>
            Adicionar
            {isLoading && <LoaderCircle size={18} className="animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  )
}
