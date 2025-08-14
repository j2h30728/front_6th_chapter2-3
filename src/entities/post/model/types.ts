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
  order: "asc" | "desc"
  search: string
  skip: number
  sortBy: "" | "id" | "none" | "reactions" | "title"
}

export type PostsResponse = { limit: number; posts: Post[]; skip: number; total: number }

export interface SearchQueryParams {
  q?: string
}

type Reaction = { dislikes: number; likes: number }
