export type User = {
  address?: Address
  age?: number
  company?: Company
  email?: string
  firstName?: string
  id: number
  image?: string
  lastName?: string
  phone?: string
  username?: string
}
export type UserQueryParams = { limit: number; select: string }

type Address = { address?: string; city?: string; state?: string }

type Company = { name?: string; title?: string }
