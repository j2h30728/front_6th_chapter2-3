import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"

import { Post } from "@/entities/post"
import { useDeletePostMutation } from "@/feature/delete-post"
import { UserSummary } from "@/feature/get-users-summary"
import { usePostsQuery } from "@/feature/post-query/model/usePostsQuery"
import { highlightText } from "@/shared/lib"
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui"

import { PostWithUserSummary } from "../model/types"

interface PostsTableProps {
  onEditPost: (post: Post) => void
  onPostDetail: (post: Post) => void
  onUserClick: (user: UserSummary) => void
  posts: PostWithUserSummary[]
}

export const PostsTable = ({ onEditPost, onPostDetail, onUserClick, posts }: PostsTableProps) => {
  const { current, updateQuery } = usePostsQuery()
  const { mutate: deletePostMutate } = useDeletePostMutation()

  const handleDeletePost = (id: number) => {
    try {
      deletePostMutate(id)
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
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
        {posts.map((post) => (
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
                onClick={() => post.author && onUserClick(post.author)}
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
                <Button aria-label="댓글 보기" onClick={() => onPostDetail(post)} size="sm" variant="ghost">
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button aria-label="게시물 수정" onClick={() => onEditPost(post)} size="sm" variant="ghost">
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
