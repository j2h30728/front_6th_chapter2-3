import { MessageSquarePlus } from "lucide-react"
import { PropsWithChildren } from "react"

import { useModal } from "@/shared/hooks/useModal"
import { Button } from "@/shared/ui"

import { AddCommentModal } from "./AddCommentModal"

interface Props {
  postId: number
}

export const AddCommentButton = ({ children, postId }: PropsWithChildren<Props>) => {
  const addCommentModal = useModal<{ postId: number }>(`add-comment-${postId}`)

  const handleAddComment = () => {
    addCommentModal.open({ postId })
  }

  return (
    <>
      <Button onClick={handleAddComment} size="sm" variant="ghost">
        <MessageSquarePlus className="w-4 h-4 mr-2" />
        {children || "댓글 추가"}
      </Button>
      <AddCommentModal modalId={`add-comment-${postId}`} />
    </>
  )
}
