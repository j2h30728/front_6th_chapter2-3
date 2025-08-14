import { useState } from "react"

import { useAddCommentMutation } from "@/feature/add-comment"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "@/shared/ui"

import { useAddCommentModal } from "../model/useAddCommentModal"

export const AddCommentModal = () => {
  const { close, data, isOpen } = useAddCommentModal()
  const { mutate: addCommentMutate } = useAddCommentMutation()
  const [commentBody, setCommentBody] = useState("")

  const handleAddComment = () => {
    if (data?.postId && commentBody.trim()) {
      addCommentMutate({
        body: commentBody,
        postId: data.postId,
        userId: 1,
      })
      setCommentBody("")
      close()
    }
  }

  const handleClose = () => {
    setCommentBody("")
    close()
  }

  return (
    <Dialog onOpenChange={handleClose} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea onChange={(e) => setCommentBody(e.target.value)} placeholder="댓글 내용" value={commentBody} />
          <Button onClick={handleAddComment}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
