import { usePostsQuery } from "@/feature/post-query"
import { highlightText } from "@/shared/lib"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"

import { usePostDetailModal } from "../model/usePostDetailModal"
import { PostComments } from "./PostComments"

export const DetailPostModal = () => {
  const { close, data: selectedPost, isOpen } = usePostDetailModal()
  const { current } = usePostsQuery()

  return (
    <Dialog onOpenChange={close} open={isOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(selectedPost?.title, current.search)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(selectedPost?.body, current.search)}</p>
          {selectedPost && <PostComments postId={selectedPost.id} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}
