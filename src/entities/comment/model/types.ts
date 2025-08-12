export type Comment = { body: string; id: number; likes: number; postId: number; user: { username: string } }

export type CommentRequest = {
  body: string
  postId: null | number
  userId: number
}
