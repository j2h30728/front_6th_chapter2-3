import { apiClient } from "@/shared/api/apiClient"

import { Comment, CommentRequest } from "../model/types"

export const commentApi = {
  async create(newComment: CommentRequest) {
    return apiClient.post<Comment>("/comments/add", newComment)
  },
  async delete(commentId: number) {
    return apiClient.delete(`/comments/${commentId}`)
  },
  async fetchByPostId(postId: number) {
    return apiClient.get<{ comments: Comment[] }>(`/comments/post/${postId}`)
  },
  async update(comment: Pick<Comment, "body" | "id">) {
    return apiClient.put<Comment>(`/comments/${comment.id}`, { body: comment.body })
  },
  async updateLike(comment: Pick<Comment, "id" | "likes">) {
    return apiClient.patch<Comment>(`/comments/${comment.id}`, { likes: comment.likes })
  },
}
