import type { Post, PostQueryParams, SearchQueryParams } from "@/entities/post/model/types"

import { PaginationResponse } from "@/shared/api"
import { apiClient } from "@/shared/api/apiClient"

export const postApi = {
  async create(post: Pick<Post, "body" | "title" | "userId">) {
    return apiClient.post<Post>("/posts/add", post)
  },
  async delete(postId: number) {
    return apiClient.delete(`/posts/${postId}`)
  },
  async getAll(params: Partial<PostQueryParams>) {
    return apiClient.get<PaginationResponse<Post>>("/posts", { params })
  },
  async getAllByTag(tag: string) {
    return apiClient.get<PaginationResponse<Post>>(`/posts/tag/${tag}`)
  },
  async search(params: SearchQueryParams) {
    return apiClient.get<PaginationResponse<Post>>("/posts/search", { params })
  },
  async update(post: Post) {
    return apiClient.put<Post>(`/posts/${post.id}`, post)
  },
}
