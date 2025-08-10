import axios from "axios"

export const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.response.use((response) => {
  console.log(response)
  return response
})
