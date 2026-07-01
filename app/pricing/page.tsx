"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tiers } from "@/lib/stripe/types"
import { getUserBilling } from "@/actions/getUserBilling"
import { StripeResponse } from "@/lib/stripe/types"
import { cn } from "@/lib/utils"

interface Feature {
    label: string
    value: string
}

interface PricingTier {
    id: Tiers
    name: string
    price: number
    description: string
    features: Feature[]
    highlighted?: boolean
}

const priceTable: Record<string, string> = {
    "pro": process.env.NEXT_PUBLIC_STRIPE_PRO_ID!,
    "max": process.env.NEXT_PUBLIC_STRIPE_MAX_ID!,
}

const tiersArr: Tiers[] = ["free", "pro", "max"]

const pillsArr: PricingTier[] = [
    {
        id: "free",
        name: "Free",
        price: 0,
        description: "Get a feel for Wayfind.",
        features: [
            { label: "daily chatbot actions", value: "5 interactions" },
            { label: "nodes per graph", value: "10 nodes" },
            { label: "saved graphs", value: "3 graphs" },
        ],
    },
    {
        id: "pro",
        name: "Pro",
        price: 10,
        description: "For regular graph building.",
        features: [
            { label: "daily chatbot actions", value: "25 interactions" },
            { label: "nodes per graph", value: "25 nodes" },
            { label: "saved graphs", value: "50 graphs" },
        ],
        highlighted: true,
    },
    {
        id: "max",
        name: "Max",
        price: 20,
        description: "For power users and teams.",
        features: [
            { label: "daily chatbot actions", value: "50 interactions" },
            { label: "nodes per graph", value: "50 nodes" },
            { label: "saved graphs", value: "Unlimited" },
        ],
    },
]

export default function PricingPage() {
    const router = useRouter()
    const { user, isLoaded } = useUser()
    const [userTier, setUserTier] = useState<Tiers | null>(null)

    useEffect(() => {
        if (!isLoaded) return

        const email = user?.primaryEmailAddress?.emailAddress
        if (!email) {
            setUserTier("free")
            return
        }

        const getUserTier = async () => {
            const { success, error, result } = await getUserBilling(email)

            if (success) {
                setUserTier(result.subscriptionTier)
            } else {
                console.error(error)
                setUserTier("free")
            }
        }

        getUserTier()
    }, [user, isLoaded])

    const currentTier = userTier ? tiersArr.indexOf(userTier) : -1
    const isLoadingTier = userTier === null

    const handleSelectPlan = async (tierId: Tiers) => {
        if (tierId === userTier) return

        const priceId = priceTable[tierId]

        if (!priceId) return

        const response = await fetch("/api/stripe/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ priceId })
        })

        const data: StripeResponse = await response.json()

        if (!data.error) {
            router.push(data.url)
        } else {
            console.error(data.error)
        }
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] py-10 px-10">
            <div className="mx-auto max-w-5xl">
                <div className="mb-12 flex justify-end">
                    <button
                        onClick={() => router.push("/dashboard")}
                        aria-label="Close and return to dashboard"
                        className="flex h-9 w-9 items-center justify-center cursor-pointer rounded-full border border-neutral-300 bg-white text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="mb-10 text-center">
                    <h1 className="font-semibold text-neutral-900 text-4xl">
                        Choose your plan
                    </h1>
                    <p className="mt-2 text-sm text-neutral-500">
                        You&apos;re currently on the
                        <span className="font-medium text-neutral-700">
                            {isLoadingTier
                                ? " ... "
                                : " " + pillsArr.find((pill) => pill.id === userTier)?.name + " "}
                        </span>
                        plan. Upgrade anytime, cancel whenever.
                    </p>
                </div>

                <div className="flex gap-x-6">
                    {pillsArr.map((pill) => {
                        const isCurrent = pill.id === userTier
                        const tierIndex = tiersArr.indexOf(pill.id)
                        const isDowngrade = tierIndex < currentTier

                        let btnLabel = `Upgrade to ${pill.name}`

                        if (isCurrent) {
                            btnLabel = "Current plan"
                        } else if (isDowngrade) {
                            btnLabel = "Manage in billing portal"
                        }

                        return (
                            <div
                                key={pill.id}
                                className={cn(
                                    "relative flex flex-col rounded-2xl border bg-white p-6",
                                    pill.highlighted && !isLoadingTier
                                        ? "border-blue-600 shadow-md -translate-y-2"
                                        : "border-neutral-200 shadow-sm"
                                )}
                            >
                                {pill.highlighted && !isCurrent && !isLoadingTier ? (
                                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white">
                                        Most popular
                                    </Badge>
                                ) : null}

                                {isCurrent ? (
                                    <Badge
                                        variant="secondary"
                                        className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neutral-800 text-white"
                                    >
                                        Current plan
                                    </Badge>
                                ) : null}

                                <h3 className="text-lg font-semibold text-neutral-900">
                                    {pill.name}
                                </h3>
                                <p className="mt-1 text-sm text-neutral-500">
                                    {pill.description}
                                </p>

                                <div className="mt-5 flex items-baseline gap-1">
                                    <span className="text-3xl font-semibold text-neutral-900">
                                        £{pill.price}
                                    </span>
                                    <span className="text-sm text-neutral-500">/ month</span>
                                </div>

                                {isLoadingTier ? (
                                    <div className="mt-6 h-9 w-full animate-pulse rounded-md bg-neutral-200" />
                                ) : (
                                    <Button
                                        onClick={() => handleSelectPlan(pill.id)}
                                        disabled={isCurrent || isDowngrade}
                                        className={cn(
                                            "mt-6 w-full",
                                            pill.highlighted
                                                ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                                : "bg-neutral-900 hover:bg-neutral-700 cursor-pointer",
                                            isCurrent || isDowngrade
                                                ? "bg-neutral-200 text-neutral-700 cursor-not-allowed hover:bg-neutral-100"
                                                : ""
                                        )}
                                    >
                                        {btnLabel}
                                    </Button>
                                )}

                                <div className="mt-6 border-t border-neutral-200 pt-5">
                                    <ul className="flex flex-col gap-y-3">
                                        {pill.features.map((feature) => (
                                            <li
                                                key={feature.label}
                                                className="flex items-start gap-x-2 text-sm"
                                            >
                                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                                                <span className="text-neutral-700">
                                                    <span className="font-medium text-neutral-900">
                                                        {feature.value}
                                                    </span>
                                                    {" " + feature.label}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}