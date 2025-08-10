/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from "msw"

// 간단한 메모리 상태 - 각 테스트에서 setup에서 재설정 가능
export const createDb = () => {
  const users = Array.from({ length: 5 }).map((_, i) => ({
    id: i + 1,
    username: `user${i + 1}`,
    image: `https://picsum.photos/seed/u${i + 1}/64/64`,
    firstName: `First${i + 1}`,
    lastName: `Last${i + 1}`,
    age: 20 + i,
    email: `user${i + 1}@example.com`,
    phone: `010-0000-00${i + 1}`,
    address: { address: `Addr ${i + 1}`, city: "Seoul", state: "KR" },
    company: { name: "ACME", title: "Engineer" },
  }))

  let posts = Array.from({ length: 25 }).map((_, i) => ({
    id: i + 1,
    title: `Post ${i + 1}`,
    body: `Post body ${i + 1}`,
    userId: (i % users.length) + 1,
    tags: ["tag-a", i % 2 === 0 ? "tag-b" : "tag-c"],
    reactions: { likes: i, dislikes: Math.floor(i / 3) },
  }))

  const commentsByPost: Record<
    number,
    Array<{ id: number; postId: number; body: string; user: { username: string }; likes: number }>
  > = {}
  let nextCommentId = 1

  const ensureComments = (postId: number) => {
    if (!commentsByPost[postId]) {
      commentsByPost[postId] = Array.from({ length: 2 }).map((_, i) => ({
        id: nextCommentId++,
        postId,
        body: `Comment ${i + 1} for post ${postId}`,
        user: { username: users[(postId + i) % users.length].username },
        likes: 0,
      }))
    }
    return commentsByPost[postId]
  }

  return { users, posts, commentsByPost, ensureComments }
}

export const buildHandlers = (db = createDb()) => [
  // posts
  http.get("/api/posts", ({ request }) => {
    const url = new URL(request.url)
    const limit = Number(url.searchParams.get("limit") ?? 10)
    const skip = Number(url.searchParams.get("skip") ?? 0)
    const slice = db.posts.slice(skip, skip + limit)
    return HttpResponse.json({ posts: slice, total: db.posts.length, skip, limit })
  }),

  http.get("/api/posts/tags", () => {
    const uniq = Array.from(new Set(db.posts.flatMap((p) => p.tags)))
    return HttpResponse.json(uniq.map((t) => ({ slug: t, url: `/tags/${t}` })))
  }),

  http.get("/api/posts/tag/:tag", ({ params }) => {
    const tag = String(params.tag)
    const filtered = db.posts.filter((p) => p.tags.includes(tag))
    return HttpResponse.json({ posts: filtered, total: filtered.length })
  }),

  http.get("/api/posts/search", ({ request }) => {
    const url = new URL(request.url)
    const q = (url.searchParams.get("q") ?? "").toLowerCase()
    const filtered = db.posts.filter((p) => p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q))
    return HttpResponse.json({ posts: filtered, total: filtered.length })
  }),

  http.post("/api/posts/add", async ({ request }) => {
    const body = (await request.json()) as any
    const newPost = { id: db.posts.length + 1, reactions: { likes: 0, dislikes: 0 }, tags: [], ...body }
    db.posts = [newPost, ...db.posts]
    return HttpResponse.json(newPost)
  }),

  http.put("/api/posts/:id", async ({ params, request }) => {
    const id = Number(params.id)
    const update = (await request.json()) as any
    db.posts = db.posts.map((p) => (p.id === id ? { ...p, ...update } : p))
    const found = db.posts.find((p) => p.id === id)
    return HttpResponse.json(found)
  }),

  http.delete("/api/posts/:id", ({ params }) => {
    const id = Number(params.id)
    db.posts = db.posts.filter((p) => p.id !== id)
    return HttpResponse.json({ success: true })
  }),

  // users
  http.get("/api/users", ({ request }) => {
    const url = new URL(request.url)
    const select = (url.searchParams.get("select") ?? "").split(",")
    const users = db.users.map((u) => {
      const base: any = { id: u.id }
      for (const key of select) {
        if (!key) continue
        base[key] = (u as any)[key]
      }
      return base
    })
    return HttpResponse.json({ users })
  }),

  http.get("/api/users/:id", ({ params }) => {
    const id = Number(params.id)
    const user = db.users.find((u) => u.id === id)
    if (!user) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(user)
  }),

  // comments
  http.get("/api/comments/post/:postId", ({ params }) => {
    const postId = Number(params.postId)
    const comments = db.ensureComments(postId)
    return HttpResponse.json({ comments })
  }),

  http.post("/api/comments/add", async ({ request }) => {
    const { body, postId } = (await request.json()) as any
    const comments = db.ensureComments(postId)
    const newComment = {
      id: comments.length ? Math.max(...comments.map((c) => c.id)) + 1 : 1,
      postId,
      body,
      user: { username: "me" },
      likes: 0,
    }
    comments.push(newComment)
    return HttpResponse.json(newComment)
  }),

  http.put("/api/comments/:id", async ({ params, request }) => {
    const id = Number(params.id)
    const update = (await request.json()) as any
    for (const postId of Object.keys(db.commentsByPost)) {
      const pid = Number(postId)
      const list = db.commentsByPost[pid]
      const idx = list?.findIndex((c) => c.id === id) ?? -1
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...update }
        return HttpResponse.json(list[idx])
      }
    }
    return new HttpResponse(null, { status: 404 })
  }),

  http.delete("/api/comments/:id", ({ params }) => {
    const id = Number(params.id)
    for (const postId of Object.keys(db.commentsByPost)) {
      const pid = Number(postId)
      const list = db.commentsByPost[pid]
      const next = list?.filter((c) => c.id !== id) ?? []
      db.commentsByPost[pid] = next
    }
    return HttpResponse.json({ success: true })
  }),

  http.patch("/api/comments/:id", async ({ params, request }) => {
    const id = Number(params.id)
    const update = (await request.json()) as any
    for (const postId of Object.keys(db.commentsByPost)) {
      const pid = Number(postId)
      const list = db.commentsByPost[pid]
      const idx = list?.findIndex((c) => c.id === id) ?? -1
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...update }
        return HttpResponse.json(list[idx])
      }
    }
    return new HttpResponse(null, { status: 404 })
  }),
]
