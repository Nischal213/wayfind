"use server"

import { Tiers } from "@/lib/stripe/types"
import { createClient } from "@/lib/supabase/server"
import { DbQueryResponse } from "@/lib/types"
import { auth } from "@clerk/nextjs/server"

interface BillingResponse {
    subscriptionTier: Tiers
    stripeCustomerId: string
}

export const getUserBilling = async (email: string): Promise<DbQueryResponse<BillingResponse>> => {
    const { isAuthenticated } = await auth()

    if (!isAuthenticated) return { success: false, error: "Unauthorized", result: { subscriptionTier: "", stripeCustomerId: "" } }

    const supabase = await createClient()
    const { data, error } = await supabase
        .from("users")
        .select("subscription_tier,stripe_customer_id")
        .eq("email", email)
        .single()

    if (error) {
        return { success: false, error: error.message, result: { subscriptionTier: "", stripeCustomerId: "" } }
    } else {
        return {
            success: true,
            error: "",
            result: {
                subscriptionTier: data.subscription_tier, stripeCustomerId: data.stripe_customer_id
            }
        }
    }


}