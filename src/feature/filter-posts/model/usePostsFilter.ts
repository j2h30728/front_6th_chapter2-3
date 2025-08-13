import { useCallback, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"

import { PostQueryParams } from "@/entities/post/model/types"

export const usePostsFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const current = useMemo(
    () =>
      ({
        limit: parseInt(searchParams.get("limit") || "10"),
        search: searchParams.get("search") || "",
        skip: parseInt(searchParams.get("skip") || "0"),
        sortBy: searchParams.get("sortBy") || "",
        sortOrder: searchParams.get("sortOrder") || "asc",
        tag: searchParams.get("tag") || "",
      }) as PostQueryParams & { tag: string },
    [searchParams],
  )

  const updateQuery = useCallback(
    (newParams: Partial<PostQueryParams & { tag: string }>) => {
      const params = new URLSearchParams()
      Object.entries({ ...current, ...newParams }).forEach(([key, value]) => {
        if (value && value !== "" && value !== 0) {
          params.set(key, value.toString())
        }
      })
      setSearchParams(params, { replace: true })
    },
    [setSearchParams],
  )

  const [previous, setPrevious] = useState(current)

  useEffect(() => {
    setPrevious(current)
  }, [current])

  const getChangedField = useCallback(() => {
    return Object.keys(current).filter(
      (key) => current[key as keyof PostQueryParams] !== previous[key as keyof PostQueryParams],
    )
  }, [current, previous])

  return { current, getChangedField, updateQuery }
}
