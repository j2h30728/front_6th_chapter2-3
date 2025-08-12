export interface Post {
  body: string
  id: number
  reactions?: Reaction
  tags?: string[]
  title: string
  userId: number
}

export interface PostQueryParams {
  limit: number
  search: string
  skip: number
  sortBy: "id" | "none" | "reactions" | "title"
  sortOrder: "asc" | "desc"
}

type Reaction = { dislikes: number; likes: number }
