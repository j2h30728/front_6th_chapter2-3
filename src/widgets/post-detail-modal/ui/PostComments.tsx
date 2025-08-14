import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"

import { Comment } from "@/entities/comment"
import { useCommentLikeMutation } from "@/feature/comment-like"
import { useDeleteCommentMutation } from "@/feature/delete-comment"
import { usePostsFilter } from "@/feature/filter-posts"
import { useGetComments } from "@/feature/get-comments"
import { highlightText } from "@/shared/lib"
import { Button } from "@/shared/ui"
import { useAddCommentModal } from "@/widgets/add-comment-modal"
import { useEditCommentModal } from "@/widgets/edit-comment-modal"

interface PostCommentsProps {
  postId: number
}

export const PostComments = ({ postId }: PostCommentsProps) => {
  const { data: comments } = useGetComments(postId)
  const { current } = usePostsFilter()

  const addCommentModal = useAddCommentModal()
  const editCommentModal = useEditCommentModal()

  const commentLikes = useCommentLikeMutation()
  const { mutate: deleteCommentMutate } = useDeleteCommentMutation()

  const handleAddComment = () => {
    addCommentModal.open({ postId })
  }

  const handleEditComment = (comment: Comment) => {
    editCommentModal.open(comment)
  }

  const handleLikeComment = (comment: Comment) => {
    commentLikes.mutate(comment)
  }

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutate(commentId)
  }

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button onClick={handleAddComment} size="sm">
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>

      <div className="space-y-1">
        {comments?.comments?.map((comment) => (
          <div className="flex items-center justify-between text-sm border-b pb-1" key={comment.id}>
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{highlightText(comment.body, current.search)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button aria-label="댓글 좋아요" onClick={() => handleLikeComment(comment)} size="sm" variant="ghost">
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button aria-label="댓글 수정" onClick={() => handleEditComment(comment)} size="sm" variant="ghost">
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button aria-label="댓글 삭제" onClick={() => handleDeleteComment(comment.id)} size="sm" variant="ghost">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
