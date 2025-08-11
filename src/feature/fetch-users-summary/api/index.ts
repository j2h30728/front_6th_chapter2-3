import { userApi } from "@/entities/user"

import { UserSummaryParams } from "../model/types"

export const fetchUsersSummary = async (params?: UserSummaryParams) => {
  const queryParams = {
    limit: params?.limit ?? 0,
    select: params?.select?.join(",") ?? "username,image",
  }

  return userApi.fetchAll(queryParams)
}
