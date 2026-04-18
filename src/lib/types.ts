export interface ApiError {
  message: string
  status: number
  code?: string
}

export interface CursorPaginated<T> {
  data: T[]
  has_more: boolean
  next_cursor: string | null
}

export interface SelectOption {
  label: string
  value: string
}
