type WithoutEntityBaseProperties<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>

export type { WithoutEntityBaseProperties }
