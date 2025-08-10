import "@testing-library/jest-dom"
import { setupServer } from "msw/node"
import { buildHandlers, createDb } from "./handlers"
import { cleanup } from "@testing-library/react"

// 각 테스트가 독립적으로 동작하도록 핸들러를 매 테스트에 재설정
export const server = setupServer(...buildHandlers(createDb()))

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))

beforeEach(() => {
  server.resetHandlers(...buildHandlers(createDb()))
})

afterEach(() => {
  cleanup()
  window.history.replaceState({}, "", "/")
})

afterAll(() => server.close())
