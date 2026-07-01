import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
    const { priceId } = await request.json()
    const user = await currentUser()
    const email = user?.primaryEmailAddress?.emailAddress

    if (!email) return NextResponse.json({ error: "Please wait for clerk to load!", url: "" })

    const session = await stripe.checkout.sessions.create({
        customer_email: email,
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    })

    return NextResponse.json({ error: "", url: session.url })
}