import { CourseStatus } from '@/types/course-status'

export const courseStatus = (value: CourseStatus) => {
  switch (value) {
    case CourseStatus.ACTIVE:
      return { variant: 'default' as const, statusName: 'Ativo' }
    case CourseStatus.INACTIVE:
      return { variant: 'destructive' as const, statusName: 'Desativado' }
    default:
      return { variant: 'default' as const, statusName: 'Não encontrado' }
  }
}
