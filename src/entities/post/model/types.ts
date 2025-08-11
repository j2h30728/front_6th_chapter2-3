export interface Post {
  body: string
  id: number
  reactions?: Reaction
  tags?: string[]
  title: string
  userId: number
}

type Reaction = { dislikes: number; likes: number }
