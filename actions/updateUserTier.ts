"use server"

import { Tiers } from "@/lib/stripe/types"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { DbActionResponse } from "@/lib/types"

export const updateUserTier = async (
    email: string | null,
    tier: Tiers,
    stripeId?: string
): Promise<DbActionResponse> => {

    if (!email) return { success: false, error: "Email doesn't exist" }
    if (!tier) return { success: false, error: "Tier doesn't exist" }

    const update: { subscription_tier: Tiers, stripe_customer_id?: string } = { subscription_tier: tier }
    if (stripeId) update.stripe_customer_id = stripeId

    const { error } = await supabaseAdmin
        .from("users")
        .update(update)
        .eq("email", email)

    if (error) {
        return { success: false, error: error.message }
    } else {
        return { success: true, error: "" }
    }
}