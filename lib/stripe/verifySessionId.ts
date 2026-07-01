"use server"

import Stripe from "stripe"

interface VerifySessionIdResponse {
    success: boolean
    complete: boolean
    email: string | null
    newTier: string | undefined
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const priceIdTable: Record<string, string> = {
    [process.env.NEXT_PUBLIC_STRIPE_PRO_ID!]: "pro",
    [process.env.NEXT_PUBLIC_STRIPE_MAX_ID!]: "max",
}

export const verifySessionId = async (id: string | null): Promise<VerifySessionIdResponse> => {
    if (!id) return { success: false, complete: false, email: null, newTier: undefined }

    try {
        const session = await stripe.checkout.sessions.retrieve(id, {
            expand: ["line_items"],
        })

        const priceId = session.line_items?.data[0]?.price?.id

        return {
            success: true,
            complete: session.status === "complete",
            email: session.customer_email,
            newTier: priceId ? priceIdTable[priceId] : undefined,
        }
    } catch {
        return { success: false, complete: false, email: null, newTier: undefined }
    }
}