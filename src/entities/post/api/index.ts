import type { Post } from "@/entities/post/model/types"

import { apiClient } from "@/shared/api/apiClient"

export interface PostQuery {
  limit: number
  search: string
  skip: number
  sortBy: "id" | "none" | "reactions" | "title"
  sortOrder: "asc" | "desc"
}

export const postApi = {
  async create(post: Pick<Post, "body" | "title" | "userId">) {
    return apiClient.post<Post>("/posts/add", post)
  },
  async delete(postId: number) {
    return apiClient.delete(`/posts/${postId}`)
  },
  async fetchAll(params: PostQuery) {
    return apiClient.get<Post[]>("/posts", { params })
  },
  async fetchAllByTag(tag: string) {
    return apiClient.get<{ posts: Post[]; total: number }>(`/posts/tag/${tag}`)
  },
  async search(params: string) {
    return apiClient.get("/posts/search", { params })
  },
  async update(post: Post) {
    return apiClient.put<Post>(`/posts/${post.id}`, post)
  },
}
