import type { IHttpService } from '@/infrastructure/ports/IHttpService'
import { API_BASE_URL } from '@/shared/constants'

// OCP: swap this for axios, ky, etc. without touching any feature code
export class FetchHttpService implements IHttpService {
  constructor(private readonly base: string = API_BASE_URL) {}

  private async request<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.base}${url}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
    return res.json() as Promise<T>
  }

  get<T>(url: string) { return this.request<T>(url) }
  post<T>(url: string, body: unknown) { return this.request<T>(url, { method: 'POST', body: JSON.stringify(body) }) }
  put<T>(url: string, body: unknown) { return this.request<T>(url, { method: 'PUT', body: JSON.stringify(body) }) }
  delete<T>(url: string) { return this.request<T>(url, { method: 'DELETE' }) }
}
