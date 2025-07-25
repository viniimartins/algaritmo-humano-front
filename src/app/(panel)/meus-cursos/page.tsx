import type { Metadata } from 'next'

import { Content } from './content'

export const metadata: Metadata = {
  title: 'Meus Cursos',
}

export default function CoursesPage() {
  return <Content />
}
