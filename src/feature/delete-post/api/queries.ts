import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Post, postApi } from "@/entities/post"
import { PaginationResponse } from "@/shared/api"

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: postApi.delete,
    onSuccess: (deletedPost) => {
      queryClient.setQueriesData({ queryKey: ["posts-with-users"] }, (prevResponse: PaginationResponse<Post>) => {
        if (!prevResponse) return prevResponse
        return {
          ...prevResponse,
          posts: prevResponse.posts.filter((post) => post.id !== deletedPost.id),
        }
      })
    },
  })
}
