"use client"

import { useState } from "react"

interface EmailFormProps {
    error : string
    loading : boolean
    onEmailSubmit : (email : string) => Promise<void>
    onGoogleSumbit : () => void
}

export const EmailForm = (props : EmailFormProps) => {
    const [email , setEmail ] = useState("")
    const { loading , error , onEmailSubmit , onGoogleSumbit } = props

    const onFormSubmit = async (e : React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        await onEmailSubmit(email)
    }

    return (
        <form onSubmit={onFormSubmit} className="space-y-4">
            <button
                type="button"
                onClick={onGoogleSumbit}
                className="w-full flex items-center justify-center gap-2 bg-transparent border border-white/20 py-3 rounded-lg hover:bg-white/5 transition"
            >
                <img
                src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                className="w-5 h-5"
                alt="Google"
                />
                Continue with Google
            </button>

            <div className="text-center text-xs text-gray-500 uppercase tracking-widest py-2">or</div>

            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#2a2a2a] border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/30 text-white"
                required
            />

            {error && <p className="text-red-400 text-xs text-center">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
            >
                {loading ? "Sending..." : "Continue with email"}
            </button>
        </form>
  )
}