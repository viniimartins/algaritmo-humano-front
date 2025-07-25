export namespace Paginated {
  export type Params = {
    page: number
    limit: number
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
