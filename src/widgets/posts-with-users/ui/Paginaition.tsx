import { usePostsQuery } from "@/feature/post-query"
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui"

import { PostWithUserSummaryReseponse } from "../model/types"

export const Pagination = ({ postsWithUsers }: { postsWithUsers: PostWithUserSummaryReseponse }) => {
  const { current, updateQuery } = usePostsQuery()

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span>표시</span>
        <Select onValueChange={(value) => updateQuery({ limit: Number(value) })} value={current.limit.toString()}>
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
  )
}
