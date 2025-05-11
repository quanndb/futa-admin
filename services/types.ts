export interface PageRequest {
  pageIndex: number
  pageSize: number
  keyword?: string
  ids?: string[]
  excludeIds?: string[]
}

export interface PageResponse<T> {
  items: T[]
  totalItems: number
  totalPages: number
  currentPage: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: Record<string, string[]>
}
