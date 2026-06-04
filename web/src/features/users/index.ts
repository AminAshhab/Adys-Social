// Public API for the users feature — only export what other features or pages need.
// Internal domain, ports, and infrastructure stay private to this feature.
export { UserList } from './components/UserList'
export type { User } from './domain/User'
