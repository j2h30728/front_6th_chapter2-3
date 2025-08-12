import type { Comment } from "@/entities/comment"

import { commentApi } from "@/entities/comment"

export const commentLikeApi = {
  async incrementLike(comment: Pick<Comment, "id" | "likes">) {
    return commentApi.updateLike(comment)
  },
}
