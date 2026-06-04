import { useUsers } from '@/features/users/hooks/useUsers'
import { Button } from '@/shared/components/ui/Button'

export function UserList() {
  const { users, loading, error } = useUsers()

  if (loading) return <p className="text-gray-500">Loading...</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Users</h2>
        <Button size="sm">Add User</Button>
      </div>

      {users.length === 0 ? (
        <p className="text-gray-500">No users yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
          {users.map((user) => (
            <li key={user.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
