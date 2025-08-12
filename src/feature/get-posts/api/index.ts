import { postApi } from "@/entities/post"
import { PostQueryParams } from "@/entities/post/model/types"

export const getPosts = async (params?: Partial<PostQueryParams>) => {
  const defaultParams = {
    limit: 10,
    skip: 0,
  }
  return postApi.getAll({ ...defaultParams, ...params })
}
