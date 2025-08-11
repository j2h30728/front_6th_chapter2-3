import type { Post } from "@/entities/post/model/types"

import { apiClient } from "@/shared/api/apiClient"

export interface PostQuery {
  limit: number
  search: string
  skip: number
  sortBy: "id" | "none" | "reactions" | "title"
  sortOrder: "asc" | "desc"
}

export const PostApi = {
  async create(post: Pick<Post, "body" | "title" | "userId">) {
    return apiClient.post("/posts/add", post)
  },
  async delete(postId: number) {
    return apiClient.delete(`/posts/${postId}`)
  },
  async fetchAll(params: PostQuery) {
    return apiClient.get<Post[]>("/posts", { params })
  },
  async update(post: Post) {
    return apiClient.put(`/posts/${post.id}`, post)
  },
}
