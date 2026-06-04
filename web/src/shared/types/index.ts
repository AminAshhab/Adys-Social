export type ID = string

export interface ApiResponse<T> {
  data: T
  status: number
  message: string
}
