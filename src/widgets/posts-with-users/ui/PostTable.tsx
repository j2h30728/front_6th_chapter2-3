import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"

import { Post } from "@/entities/post"
import { useDeletePostMutation } from "@/feature/delete-post"
import { UserSummary } from "@/feature/get-users-summary"
import { usePostsQuery } from "@/feature/post-query/model/usePostsQuery"
import { highlightText } from "@/shared/lib"
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui"
import { useEditPostModal } from "@/widgets/edit-post-modal"
import { usePostDetailModal } from "@/widgets/post-detail-modal"
import { useUserProfileModal } from "@/widgets/user-profile-modal"

import { usePostsWithUserSummaryQuery } from "../api/queries"

export const PostsTable = () => {
  const { current, updateQuery } = usePostsQuery()
  const { mutate: deletePostMutate } = useDeletePostMutation()
  const { data: postsWithUsers, isLoading } = usePostsWithUserSummaryQuery()

  const editPostModal = useEditPostModal()
  const postDetailModal = usePostDetailModal()
  const userProfileModal = useUserProfileModal()

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

  const handleDeletePost = (id: number) => {
    try {
      deletePostMutate(id)
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-4">로딩 중...</div>
  }

  return (
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
        {postsWithUsers?.posts.map((post) => (
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
                      onClick={() => updateQuery({ tag })}
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
                <Button aria-label="게시물 삭제" onClick={() => handleDeletePost(post.id)} size="sm" variant="ghost">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
