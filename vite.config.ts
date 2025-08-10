import path from "path"

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/app": path.resolve(__dirname, "src/app"),
      "@/entities": path.resolve(__dirname, "src/entities"),
      "@/features": path.resolve(__dirname, "src/features"),
      "@/pages": path.resolve(__dirname, "src/pages"),
      "@/shared": path.resolve(__dirname, "src/shared"),
      "@/widgets": path.resolve(__dirname, "src/widgets"),
      "~": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        target: "https://dummyjson.com",
      },
    },
  },
})
