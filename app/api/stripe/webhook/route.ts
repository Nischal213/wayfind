import { updateUserTier } from "@/actions/updateUserTier";
import { Tiers } from "@/lib/stripe/types";
import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    } catch (err) {
        return new Response("Invalid signature", { status: 400 })
    }

    if (event.type === "invoice.payment_succeeded") {
        const session = event.data.object
        const priceId = session.lines.data[0].pricing?.price_details?.price
        let plan: Tiers = ""

        if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_ID!) {
            plan = "pro"
        } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_MAX_ID!) {
            plan = "max"
        } else {
            return new Response("Unknown price", { status: 400 })
        }

        const { success, error } = await updateUserTier(session.customer_email, plan, session.customer as string)

        if (!success) console.log(error)
    } else if (event.type === "customer.subscription.deleted") {
        const session = event.data.object
        const customer = await stripe.customers.retrieve(session.customer as string)
        const email = (customer as Stripe.Customer).email

        const { success, error } = await updateUserTier(email, "free")

        if (!success) console.log(error)
    }

    return new Response("ok", { status: 200 })
}
