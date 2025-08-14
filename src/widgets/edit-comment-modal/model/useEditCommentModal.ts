import { Comment } from "@/entities/comment"
import { useModal } from "@/shared/hooks/useModal"

export const useEditCommentModal = () => {
  return useModal<Comment>("editComment")
}
