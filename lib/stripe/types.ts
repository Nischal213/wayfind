export type Tiers = "free" | "pro" | "max" | ""

export interface StripeResponse {
    url: string
    error: string
}