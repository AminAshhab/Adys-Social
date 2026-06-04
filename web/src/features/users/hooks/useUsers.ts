import { useEffect, useState } from 'react'
import type { User } from '@/features/users/domain/User'
import { container } from '@/infrastructure/di/container'

interface State {
  users: User[]
  loading: boolean
  error: string | null
}

export function useUsers(): State {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    container.getUsersUseCase
      .execute()
      .then((data) => { if (!cancelled) setUsers(data) })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unknown error')
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { users, loading, error }
}
