import { Edit2, MessageSquare, Plus, Search, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { useState } from "react"

import { Comment } from "@/entities/comment"
import { Post, PostQueryParams } from "@/entities/post"
import { Tag } from "@/entities/tag"
import { User, userApi } from "@/entities/user"
import { useAddCommentMutation } from "@/feature/add-comment"
import { useAddPostMutation } from "@/feature/add-post"
import { useCommentLikeMutation } from "@/feature/comment-like"
import { useDeleteCommentMutation } from "@/feature/delete-comment"
import { useDeletePostMutation } from "@/feature/delete-post"
import { usePostsFilter } from "@/feature/filter-posts/model/usePostsFilter"
import { useGetComments } from "@/feature/get-comments"
import { useGetTags } from "@/feature/get-tags"
import { UserSummary } from "@/feature/get-users-summary"
import { useUpdateCommentMutation } from "@/feature/update-comment"
import { useUpdatePostMutation } from "@/feature/update-post"
import { highlightText } from "@/shared/lib"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  Textarea,
} from "@/shared/ui"
import { usePostsWithUserSummaryQuery } from "@/widgets/posts-with-users"

export const PostsManagerPage = () => {
  const { current, updateQuery } = usePostsFilter()

  interface PostWithUserSummary extends Post {
    author?: UserSummary
  }

  // 선택된 게시물 상태
  const [selectedPost, setSelectedPost] = useState<Post>()

  // 모달 상태
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  // 새 게시물 상태
  const [newPost, setNewPost] = useState<{ body: string; title: string; userId: number }>({
    body: "",
    title: "",
    userId: 1,
  })

  // 선택된 댓글 상태
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)

  // 코멘트 모달 새 댓글 상태
  const [newComment, setNewComment] = useState<{ body: string; postId: null | number; userId: number }>({
    body: "",
    postId: null,
    userId: 1,
  })

  // 코멘트 모달 내부 상태
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false) // 댓글 추가 모달 상태
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false) // 댓글 수정 모달 상태

  // 모달 상태
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false) // 게시물 상세 보기 모달 상태
  const [showUserModal, setShowUserModal] = useState(false) // 사용자 정보 모달 상태
  const [selectedUser, setSelectedUser] = useState<null | User>(null) // 선택된 사용자 상태 (모달 정보)

  const { data: postsWithUsers, isLoading, refetch } = usePostsWithUserSummaryQuery()

  const { data: tagsData } = useGetTags()

  // 게시물 검색
  const searchPosts = async () => {
    if (!current.search) {
      refetch()
      return
    }
  }
  const { mutate: addPostMuate } = useAddPostMutation()
  // 게시물 추가

  const addPost = async () => {
    try {
      addPostMuate(newPost)
      setShowAddDialog(false)
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  const { mutate: updatePostMutate } = useUpdatePostMutation()

  // 게시물 업데이트
  const updatePost = async () => {
    if (!selectedPost) return
    try {
      updatePostMutate(selectedPost)
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  const { mutate: deletePostMutate } = useDeletePostMutation()

  // 게시물 삭제
  const deletePost = async (id: number) => {
    try {
      await deletePostMutate(id)
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  // 댓글 가져오기
  const { data: comment } = useGetComments(selectedPost?.id)

  // 댓글 추가
  const { mutate: addCommentMutate } = useAddCommentMutation()

  const { mutate: updatedCommentMutate } = useUpdateCommentMutation()
  // 댓글 업데이트
  const updateComment = async () => {
    if (!selectedComment || !selectedPost) return
    try {
      updatedCommentMutate({
        ...selectedComment,
        body: selectedComment.body,
        postId: selectedPost.id,
      })
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  const { mutate: deleteCommentMutate } = useDeleteCommentMutation()
  // 댓글 삭제
  const deleteComment = async (id: number) => {
    try {
      deleteCommentMutate(id)
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }
  const commentLikes = useCommentLikeMutation()
  // 댓글 좋아요
  const likeComment = async (comment: Comment) => {
    try {
      commentLikes.mutate(comment)
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기
  const openUserModal = async (user: UserSummary) => {
    try {
      const userData: User = await userApi.getById(user.id)
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
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
                onClick={() => post.author && openUserModal(post.author)}
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
                <Button
                  aria-label="게시물 수정"
                  onClick={() => {
                    setSelectedPost(post)
                    setShowEditDialog(true)
                  }}
                  size="sm"
                  variant="ghost"
                >
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

  // 댓글 렌더링
  const renderComments = (postId: number) => (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          onClick={() => {
            setNewComment((prev) => ({ ...prev, postId }))
            setShowAddCommentDialog(true)
          }}
          size="sm"
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comment?.comments?.map((comment) => (
          <div className="flex items-center justify-between text-sm border-b pb-1" key={comment.id}>
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{highlightText(comment.body, current.search)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button aria-label="댓글 좋아요" onClick={() => likeComment(comment)} size="sm" variant="ghost">
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button
                aria-label="댓글 수정"
                onClick={() => {
                  setSelectedComment(comment)
                  setShowEditCommentDialog(true)
                }}
                size="sm"
                variant="ghost"
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button aria-label="댓글 삭제" onClick={() => deleteComment(comment.id)} size="sm" variant="ghost">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateQuery({ search: e.target.value })}
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && searchPosts()}
                  placeholder="게시물 검색..."
                  value={current.search}
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
          {postsWithUsers && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span>표시</span>
                <Select
                  onValueChange={(value) => updateQuery({ limit: Number(value) })}
                  value={current.limit.toString()}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                  </SelectContent>
                </Select>
                <span>항목</span>
              </div>
              <div className="flex gap-2">
                <Button
                  disabled={current.skip === 0}
                  onClick={() => updateQuery({ skip: Math.max(0, current.skip - current.limit) })}
                >
                  이전
                </Button>
                <Button
                  disabled={current.skip + current.limit >= postsWithUsers.total}
                  onClick={() => updateQuery({ skip: current.skip + current.limit })}
                >
                  다음
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <Dialog onOpenChange={setShowAddDialog} open={showAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 게시물 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPost({ ...newPost, title: e.target.value })}
              placeholder="제목"
              value={newPost.title}
            />
            <Textarea
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewPost({ ...newPost, body: e.target.value })}
              placeholder="내용"
              rows={30}
              value={newPost.body}
            />
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewPost({ ...newPost, userId: Number(e.target.value) })
              }
              placeholder="사용자 ID"
              type="number"
              value={newPost.userId}
            />
            <Button onClick={addPost}>게시물 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 수정 대화상자 */}
      <Dialog onOpenChange={setShowEditDialog} open={showEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSelectedPost((prev) => (prev ? { ...prev, title: e.target.value } : prev))
              }
              placeholder="제목"
              value={selectedPost?.title || ""}
            />
            <Textarea
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setSelectedPost((prev) => (prev ? { ...prev, body: e.target.value } : prev))
              }
              placeholder="내용"
              rows={15}
              value={selectedPost?.body || ""}
            />
            <Button onClick={updatePost}>게시물 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 추가 대화상자 */}
      <Dialog onOpenChange={setShowAddCommentDialog} open={showAddCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 댓글 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNewComment({ ...newComment, body: e.target.value })
              }
              placeholder="댓글 내용"
              value={newComment.body}
            />
            <Button
              onClick={() => {
                addCommentMutate(newComment)
                setShowAddCommentDialog(false)
              }}
            >
              댓글 추가
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 수정 대화상자 */}
      <Dialog onOpenChange={setShowEditCommentDialog} open={showEditCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setSelectedComment((prev) => (prev ? { ...prev, body: e.target.value } : prev))
              }
              placeholder="댓글 내용"
              value={selectedComment?.body || ""}
            />
            <Button onClick={updateComment}>댓글 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog onOpenChange={setShowPostDetailDialog} open={showPostDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{highlightText(selectedPost?.title, current.search)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(selectedPost?.body, current.search)}</p>
            {selectedPost && renderComments(selectedPost.id)}
          </div>
        </DialogContent>
      </Dialog>

      {/* 사용자 모달 */}
      <Dialog onOpenChange={setShowUserModal} open={showUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 정보</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img alt={selectedUser?.username} className="w-24 h-24 rounded-full mx-auto" src={selectedUser?.image} />
            <h3 className="text-xl font-semibold text-center">{selectedUser?.username}</h3>
            <div className="space-y-2">
              <p>
                <strong>이름:</strong> {selectedUser?.firstName} {selectedUser?.lastName}
              </p>
              <p>
                <strong>나이:</strong> {selectedUser?.age}
              </p>
              <p>
                <strong>이메일:</strong> {selectedUser?.email}
              </p>
              <p>
                <strong>전화번호:</strong> {selectedUser?.phone}
              </p>
              <p>
                <strong>주소:</strong> {selectedUser?.address?.address}, {selectedUser?.address?.city},{" "}
                {selectedUser?.address?.state}
              </p>
              <p>
                <strong>직장:</strong> {selectedUser?.company?.name} - {selectedUser?.company?.title}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
