import { useQuery } from "@tanstack/react-query"

import { usePostsFilter } from "@/feature/filter-posts/model/usePostsFilter"
import { getPosts } from "@/feature/get-posts/api"
import { getUsersSummary } from "@/feature/get-users-summary"

export const usePostsWithUserSummaryQuery = () => {
  const { current, getChangedField } = usePostsFilter()
  const { limit, order, search, skip, sortBy, tag } = current

  return useQuery({
    queryFn: async () => {
      const postsData = await getPosts(current, getChangedField())

      const userData = await getUsersSummary()

      return {
        ...postsData,
        posts: postsData.posts.map((post) => ({
          ...post,
          author: userData.users.find((user) => user.id === post.userId),
        })),
      }
    },
    queryKey: ["posts-with-users", { limit, order, search, skip, sortBy, tag }],
  })
}
