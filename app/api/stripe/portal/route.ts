import { getUserBilling } from "@/actions/getUserBilling"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
    const user = await currentUser()
    const email = user?.primaryEmailAddress?.emailAddress

    if (!email) return NextResponse.json({ error: "Please wait for clerk to finish loading!", url: "" })

    const { success, error, result } = await getUserBilling(email)
    if (!success) return NextResponse.json({ error: error, url: "" })
    if (!result.stripeCustomerId) return NextResponse.json({ error: "No billing account found!", url: "" })

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: result.stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    })

    return NextResponse.json({ error: "", url: portalSession.url })
}