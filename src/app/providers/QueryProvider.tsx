import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"

interface QueryProviderProps {
  children: ReactNode
}

const queyrClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
})

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return <QueryClientProvider client={queyrClient}>{children}</QueryClientProvider>
}
