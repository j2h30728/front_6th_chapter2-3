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
    const result = await apiClient.post("/posts/add", post)
    return result.data
  },
  async delete(postId: number) {
    const result = await apiClient.delete(`/posts/${postId}`)
    return result.data
  },
  async fetchAll(params: PostQuery) {
    const result = await apiClient.get<Post[]>("/posts", { params })
    return result.data
  },
  async update(post: Post) {
    const result = await apiClient.put(`/posts/${post.id}`, post)
    return result.data
  },
}
