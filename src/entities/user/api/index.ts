import { apiClient } from "@/shared/api/apiClient"

import { User, UserQueryParams } from "../model/types"

export const userApi = {
  async getAll(params: UserQueryParams) {
    return apiClient.get<{ users: Array<User> }>("/users", {
      params,
    })
  },
  async getById(userId: number) {
    return apiClient.get<User>(`/users/${userId}`)
  },
}
