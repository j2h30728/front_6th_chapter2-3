import { Edit2, MessageSquare, Plus, Search, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

import { Post, PostQueryParams } from "@/entities/post"
import { Tag } from "@/entities/tag"
import { useDeletePostMutation } from "@/feature/delete-post"
import { usePostsFilter } from "@/feature/filter-posts/model/usePostsFilter"
import { useGetTags } from "@/feature/get-tags"
import { UserSummary } from "@/feature/get-users-summary"
import { useDebounceValue } from "@/shared/hooks/useDebounceValue"
import { highlightText } from "@/shared/lib"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui"
import { AddCommentModal } from "@/widgets/add-comment-modal"
import { AddPostModal, useAddPostModal } from "@/widgets/add-post-modal"
import { EditCommentModal } from "@/widgets/edit-comment-modal"
import { EditPostModal, useEditPostModal } from "@/widgets/edit-post-modal"
import { DetailPostModal, usePostDetailModal } from "@/widgets/post-detail-modal"
import { usePostsWithUserSummaryQuery } from "@/widgets/posts-with-users"
import { Pagination } from "@/widgets/posts-with-users/ui/Paginaition"
import { UserProfileModal, useUserProfileModal } from "@/widgets/user-profile-modal"

export const PostsManagerPage = () => {
  const { current, updateQuery } = usePostsFilter()

  interface PostWithUserSummary extends Post {
    author?: UserSummary
  }

  const addPostModal = useAddPostModal()
  const editPostModal = useEditPostModal()
  const postDetailModal = usePostDetailModal()
  const userProfileModal = useUserProfileModal()

  const { data: postsWithUsers, isLoading } = usePostsWithUserSummaryQuery()
  const { data: tagsData } = useGetTags()
  const { mutate: deletePostMutate } = useDeletePostMutation()

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

  // 게시물 삭제
  const deletePost = (id: number) => {
    try {
      deletePostMutate(id)
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  // 게시물 테이블 렌더링
  const renderPostTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {postsWithUsers?.posts.map((post: PostWithUserSummary) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>{highlightText(post.title, current.search)}</div>

                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag: string) => (
                    <span
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        current.tag === tag
                          ? "text-white bg-blue-500 hover:bg-blue-600"
                          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                      }`}
                      key={tag}
                      onClick={() => {
                        updateQuery({ tag })
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => post.author && handleOpenUserProfile(post.author)}
              >
                <img alt={post.author?.username} className="w-8 h-8 rounded-full" src={post.author?.image} />
                <span>{post.author?.username}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className="w-4 h-4" />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button aria-label="댓글 보기" onClick={() => openPostDetail(post)} size="sm" variant="ghost">
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button aria-label="게시물 수정" onClick={() => handleEditPost(post)} size="sm" variant="ghost">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button aria-label="게시물 삭제" onClick={() => deletePost(post.id)} size="sm" variant="ghost">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

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
          {isLoading ? <div className="flex justify-center p-4">로딩 중...</div> : renderPostTable()}

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
