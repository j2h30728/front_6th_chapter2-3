import { postApi } from "@/entities/post"

export const searchPostsByKeyword = async (keyword: string) => {
  const queryParams = {
    q: keyword,
  }
  return postApi.search(queryParams)
}
