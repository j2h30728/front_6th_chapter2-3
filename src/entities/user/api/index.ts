import { apiClient } from "@/shared/api/apiClient"

import { FetchUserParams, User } from "../model/types"

export const userApi = {
  async fetchAll(params: FetchUserParams) {
    return apiClient.get<{ users: Array<User> }>("/users", {
      params,
    })
  },
  async fetchById(userId: number) {
    return apiClient.get<User>(`/users/${userId}`)
  },
}
