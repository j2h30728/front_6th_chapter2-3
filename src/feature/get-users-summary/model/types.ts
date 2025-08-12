import { User } from "@/entities/user"

export type UserSummaryParams = { limit: number; select: (keyof User)[] }
