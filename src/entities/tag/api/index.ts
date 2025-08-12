import { apiClient } from "@/shared/api/apiClient"

import { Tag } from "../model/types"

export const TagApi = {
  async fetchAll() {
    return apiClient.get<Tag[]>("/posts/tags")
  },
}
