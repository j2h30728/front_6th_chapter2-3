import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { Comment } from "@/entities/comment"

import { commentApi } from "@/entities/comment"

export const useCommentLikeMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (comment: Pick<Comment, "id" | "likes" | "postId">) => commentApi.updateLike(comment),

    onError: (err, variables, context) => {
      const typedContext = context as { previousComments?: Comment[] }
      if (typedContext.previousComments) {
        queryClient.setQueryData(["comments", variables.postId], typedContext.previousComments)
      }
    },

    onMutate: async ({ id, likes, postId }) => {
      await queryClient.cancelQueries({ queryKey: ["comments", postId] })

      const previousComments = queryClient.getQueryData(["comments", postId])

      queryClient.setQueryData(["coments", postId], (old: Comment[]) =>
        old?.map((comment) => (comment.id === id ? { ...comment, likes: likes + 1 } : comment)),
      )
      return previousComments
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      })
    },
  })
}
