import { apiClient } from "@/shared/api/apiClient"

import { Comment } from "../model/types"

export const commentApi = {
  async create() {
    const result = await apiClient.post("/comments/add")
    return result.data
  },
  async delete(commentId: number) {
    const result = await apiClient.delete(`/comments/${commentId}`)
    return result.data
  },
  async fetchById(postId: number) {
    const result = await apiClient.get<Comment>(`/comments/post/${postId}`)
    return result.data
  },
  async update(comment: Comment) {
    const result = await apiClient.put(`/comments/${comment.id}`)
    return result.data
  },
}
