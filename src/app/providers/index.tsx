import { ReactNode } from "react"

import { RouterProvider } from "./RouterProvider"

interface AppProvidersProps {
  children: ReactNode
}

export const AppProvider = ({ children }: AppProvidersProps) => {
  return <RouterProvider>{children}</RouterProvider>
}
