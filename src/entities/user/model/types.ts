export type FetchUserParams = { limit: number; select: string }
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

type Address = { address?: string; city?: string; state?: string }

type Company = { name?: string; title?: string }
