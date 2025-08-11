import { apiClient } from "@/shared/api/apiClient"

import { Comment } from "../model/types"

export const commentApi = {
  async create() {
    return apiClient.post("/comments/add")
  },
  async delete(commentId: number) {
    return apiClient.delete(`/comments/${commentId}`)
  },
  async fetchById(postId: number) {
    return apiClient.get<Comment>(`/comments/post/${postId}`)
  },
  async update(comment: Comment) {
    return apiClient.put(`/comments/${comment.id}`)
  },
}
