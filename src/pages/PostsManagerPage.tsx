import { Plus } from "lucide-react"

import { Post } from "@/entities/post"
import { UserSummary } from "@/feature/get-users-summary"
import { PostsFilter } from "@/feature/posts-filter"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui"
import { AddCommentModal } from "@/widgets/add-comment-modal"
import { AddPostModal, useAddPostModal } from "@/widgets/add-post-modal"
import { EditCommentModal } from "@/widgets/edit-comment-modal"
import { EditPostModal, useEditPostModal } from "@/widgets/edit-post-modal"
import { DetailPostModal, usePostDetailModal } from "@/widgets/post-detail-modal"
import { PostsTable, usePostsWithUserSummaryQuery } from "@/widgets/posts-with-users"
import { Pagination } from "@/widgets/posts-with-users/ui/Paginaition"
import { UserProfileModal, useUserProfileModal } from "@/widgets/user-profile-modal"

export const PostsManagerPage = () => {
  const addPostModal = useAddPostModal()
  const editPostModal = useEditPostModal()
  const postDetailModal = usePostDetailModal()
  const userProfileModal = useUserProfileModal()

  const { data: postsWithUsers, isLoading } = usePostsWithUserSummaryQuery()

  // 모달 핸들러들
  const openPostDetail = (post: Post) => {
    postDetailModal.open(post)
  }

  const handleOpenUserProfile = (user: UserSummary) => {
    userProfileModal.open(user)
  }

  const handleEditPost = (post: Post) => {
    editPostModal.open(post)
  }

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
          {/* 검색 및 필터 컨트롤 */}
          <PostsFilter />

          {/* 게시물 테이블 */}
          {isLoading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostsTable
              onEditPost={handleEditPost}
              onPostDetail={openPostDetail}
              onUserClick={handleOpenUserProfile}
              posts={postsWithUsers?.posts || []}
            />
          )}

          {/* 페이지네이션 */}
          {postsWithUsers && <Pagination postsWithUsers={postsWithUsers} />}
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
