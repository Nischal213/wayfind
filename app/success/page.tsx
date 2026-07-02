"use client"

import { getUserBilling } from "@/actions/getUserBilling"
import { verifySessionId } from "@/lib/stripe/verifySessionId"
import { CreditCard, AlertCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function SuccessPage() {
    const searchParams = useSearchParams()
    const sessionIdValue = searchParams.get("session_id")
    const router = useRouter()
    const [timeOut, setTimeOut] = useState(false)

    useEffect(() => {
        const verifyPayment = async () => {
            const { success, complete, email, newTier } = await verifySessionId(sessionIdValue)

            if (!success || !complete || !email) return router.push("/dashboard")

            let attempts = 0
            const interval = setInterval(async () => {
                attempts++
                if (attempts >= 10) {
                    clearInterval(interval)
                    setTimeOut(true)
                    return
                }

                const { result } = await getUserBilling(email)
                console.log(newTier)

                if (result.subscriptionTier === newTier) {
                    clearInterval(interval)
                    return router.push("/dashboard")
                }

            }, 1000)
        }

        verifyPayment()
    })

    return (
        <>
            {timeOut ?
                <div className="flex flex-col items-center justify-center min-h-screen gap-y-6">
                    <div className="rounded-full bg-amber-100 p-5 text-amber-500">
                        <AlertCircle size={32} />
                    </div>
                    <h1 className="text-2xl font-medium text-neutral-700">Taking longer than expected</h1>
                    <p className="text-neutral-600/90 text-center max-w-sm text-sm leading-snug">
                        Your payment went through, but we&apos;re still syncing your account. This can take a minute — check your dashboard, your plan should appear shortly.
                    </p>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="rounded-md cursor-pointer bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
                    >
                        Go to dashboard
                    </button>
                </div>
                :
                <div className="flex flex-col items-center justify-center min-h-screen gap-y-6">
                    <div className="rounded-full bg-green-100 p-5 text-green-500">
                        <CreditCard size={32} />
                    </div>
                    <h1 className="text-2xl font-medium text-neutral-700">Setting up your account</h1>
                    <p className="text-neutral-600/90 text-center max-w-sm">
                        Your payment is being confirmed. This usually takes a couple of seconds.
                    </p>

                    <div className="flex gap-x-1.5">
                        <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:0ms]" />
                        <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:150ms]" />
                        <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:300ms]" />
                    </div>
                </div>}
        </>
    )
}