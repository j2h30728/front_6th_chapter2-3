import { useEffect, useState } from "react"

import { useUpdateCommentMutation } from "@/feature/update-comment"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "@/shared/ui"

import { useEditCommentModal } from "../model/useEditCommentModal"

export const EditCommentModal = () => {
  const { close, data: selectedComment, isOpen } = useEditCommentModal()
  const { mutate: updateCommentMutate } = useUpdateCommentMutation()
  const [commentBody, setCommentBody] = useState("")

  // 모달이 열릴 때 기존 댓글 내용 설정
  useEffect(() => {
    if (selectedComment) {
      setCommentBody(selectedComment.body)
    }
  }, [selectedComment])

  const handleUpdateComment = () => {
    if (selectedComment && commentBody.trim()) {
      updateCommentMutate({
        ...selectedComment,
        body: commentBody,
      })
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
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea onChange={(e) => setCommentBody(e.target.value)} placeholder="댓글 내용" value={commentBody} />
          <Button onClick={handleUpdateComment}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
