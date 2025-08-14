import { Post } from "@/entities/post"
import { useModal } from "@/shared/hooks/useModal"

export const useEditPostModal = () => {
  return useModal<Post>("editPost")
}
