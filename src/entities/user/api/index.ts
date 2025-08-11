import { apiClient } from "@/shared/api/apiClient"

import { FetchUserParams, User } from "../model/types"

export const userApi = {
  async fetchAll(params: FetchUserParams) {
    const result = await apiClient.get<Array<User>>("/users", {
      params,
    })
    return result.data
  },
  async fetchById(userId: number) {
    const result = await apiClient.get<User>(`/users/${userId}`)
    return result.data
  },
}
