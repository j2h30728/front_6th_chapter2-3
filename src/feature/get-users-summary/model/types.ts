import { User } from "@/entities/user"

export type UserSummary = { id: number; image?: string; username?: string }
export type UserSummaryParams = { limit: number; select: (keyof User)[] }
