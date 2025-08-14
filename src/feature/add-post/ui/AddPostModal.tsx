import { useState } from "react"

import { useAddPostMutation } from "@/feature/add-post"
import { useAddPostModal } from "@/feature/add-post/model/useAddPostModal"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@/shared/ui"

export const AddPostModal = () => {
  const { close, isOpen } = useAddPostModal()
  const { mutate: addPostMutate } = useAddPostMutation()

  const [newPost, setNewPost] = useState({
    body: "",
    title: "",
    userId: 1,
  })

  const handleAddPost = () => {
    if (newPost.title.trim() && newPost.body.trim()) {
      addPostMutate(newPost)
      setNewPost({ body: "", title: "", userId: 1 })
      close()
    }
  }

  const handleClose = () => {
    setNewPost({ body: "", title: "", userId: 1 })
    close()
  }

  return (
    <Dialog onOpenChange={handleClose} open={isOpen}>
      <DialogContent aria-label="새 게시물 추가">
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            placeholder="제목"
            value={newPost.title}
          />
          <Textarea
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            placeholder="내용"
            rows={10}
            value={newPost.body}
          />
          <Input
            onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
            placeholder="사용자 ID"
            type="number"
            value={newPost.userId}
          />
          <Button onClick={handleAddPost}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
