import { Plus, Search } from "lucide-react"
import { useEffect, useState } from "react"

import { Post, PostQueryParams } from "@/entities/post"
import { Tag } from "@/entities/tag"
import { usePostsFilter } from "@/feature/filter-posts/model/usePostsFilter"
import { useGetTags } from "@/feature/get-tags"
import { UserSummary } from "@/feature/get-users-summary"
import { useDebounceValue } from "@/shared/hooks/useDebounceValue"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui"
import { AddCommentModal } from "@/widgets/add-comment-modal"
import { AddPostModal, useAddPostModal } from "@/widgets/add-post-modal"
import { EditCommentModal } from "@/widgets/edit-comment-modal"
import { EditPostModal, useEditPostModal } from "@/widgets/edit-post-modal"
import { DetailPostModal, usePostDetailModal } from "@/widgets/post-detail-modal"
import { PostsTable, usePostsWithUserSummaryQuery } from "@/widgets/posts-with-users"
import { Pagination } from "@/widgets/posts-with-users/ui/Paginaition"
import { UserProfileModal, useUserProfileModal } from "@/widgets/user-profile-modal"

export const PostsManagerPage = () => {
  const { current, updateQuery } = usePostsFilter()

  const addPostModal = useAddPostModal()
  const editPostModal = useEditPostModal()
  const postDetailModal = usePostDetailModal()
  const userProfileModal = useUserProfileModal()

  const { data: postsWithUsers, isLoading } = usePostsWithUserSummaryQuery()
  const { data: tagsData } = useGetTags()

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

  // 검색 관련 상태와 핸들러
  const [inputValue, setInputValue] = useState(current.search || "")
  const debouncedSearchQuery = useDebounceValue(inputValue, 500)

  useEffect(() => {
    updateQuery({ search: debouncedSearchQuery })
  }, [debouncedSearchQuery, updateQuery])

  useEffect(() => {
    setInputValue(current.search || "")
  }, [current.search])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateQuery({ search: inputValue })
    }
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
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  aria-label="게시물 검색"
                  className="pl-8"
                  onChange={handleSearchChange}
                  onKeyPress={handleSearchKeyPress}
                  placeholder="게시물 검색..."
                  value={inputValue}
                />
              </div>
            </div>
            <Select
              onValueChange={(value) => {
                updateQuery({ tag: value })
              }}
              value={current.tag}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="태그 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 태그</SelectItem>
                {tagsData?.map((tag: Tag) => (
                  <SelectItem key={tag.url} value={tag.slug}>
                    {tag.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value: string) => updateQuery({ sortBy: value as PostQueryParams["sortBy"] })}
              value={current.sortBy}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="title">제목</SelectItem>
                <SelectItem value="reactions">반응</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => updateQuery({ order: value as PostQueryParams["order"] })}
              value={current.order}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 순서" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">오름차순</SelectItem>
                <SelectItem value="desc">내림차순</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
