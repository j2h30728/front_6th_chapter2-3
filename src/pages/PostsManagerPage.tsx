import { Plus } from "lucide-react"

import { PostsFilter } from "@/feature/posts-filter"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui"
import { AddCommentModal } from "@/widgets/add-comment-modal"
import { AddPostModal, useAddPostModal } from "@/widgets/add-post-modal"
import { EditCommentModal } from "@/widgets/edit-comment-modal"
import { EditPostModal } from "@/widgets/edit-post-modal"
import { DetailPostModal } from "@/widgets/post-detail-modal"
import { PostsTable } from "@/widgets/posts-with-users"
import { Pagination } from "@/widgets/posts-with-users/ui/Paginaition"
import { UserProfileModal } from "@/widgets/user-profile-modal"

export const PostsManagerPage = () => {
  const addPostModal = useAddPostModal()

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => addPostModal.open()}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <PostsFilter />
          <PostsTable />
          <Pagination />
        </div>
      </CardContent>

      <AddPostModal />
      <EditPostModal />
      <AddCommentModal />
      <EditCommentModal />
      <DetailPostModal />
      <UserProfileModal />
    </Card>
  )
}
