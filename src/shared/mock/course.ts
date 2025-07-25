import type { Paginated } from '@/helpers/paginated'
import type { ICourse } from '@/modules/courses/model'
import { CourseStatus } from '@/types/course-status'

const mock: ICourse = {
  id: crypto.randomUUID(),
  title: 'Teste',
  description: 'Teste',
  duration: '10:10',
  image:
    'https://storage.googleapis.com/eti-academy/courses/curso-introducao-ao-typescript.png',
  status: CourseStatus.ACTIVE,
  updatedAt: new Date(),
  createdAt: new Date(),
}

const content = Array.from({ length: 8 }, (_, index) => ({
  ...mock,
  id: mock.id + index,
}))

export const ProductMock: Paginated.Response<ICourse> = {
  data: content,
  pages: 1,
  total: 20,
}
