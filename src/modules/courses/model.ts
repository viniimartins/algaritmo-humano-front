import type { IBaseEntity } from '@/helpers/base-entity'
import type { CourseStatus } from '@/types/course-status'

export interface ICourse extends IBaseEntity {
  title: string
  description: string
  image: string
  duration: string
  status: CourseStatus
}
