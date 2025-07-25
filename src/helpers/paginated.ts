export namespace Paginated {
  export type Params = {
    page: number
    limit: number
    filters?: string[]
  }

  export type Response<T> = {
    data: T[]
    pages: number
    total: number
  }

  export type Meta = {
    pages: number
    total: number
    currentPage: number
  }
}
