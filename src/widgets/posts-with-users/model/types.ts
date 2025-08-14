import { Post, PostPagiantionReponse } from "@/entities/post"
import { UserSummary } from "@/feature/get-users-summary"

export interface PostWithUserSummary extends Post {
  author?: UserSummary
}

export type PostWithUserSummaryReseponse = PostPagiantionReponse<PostWithUserSummary>
