export type AddCommentResponse = Omit<Comment, "likes">

export type Comment = {
  body: string
  id: number
  likes: number
  postId: number
  user: {
    fullName: string
    id: number
    username: string
  }
}

export type CommentRequest = {
  body: string
  postId: null | number
  userId: number
}

export type CommentResponse = { comments: Comment[]; limit: number; skip: number; total: number }

export type DeleteCommentResponse = Comment & {
  isDeleted: boolean
}
