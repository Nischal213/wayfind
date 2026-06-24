"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { GoogleOAuthField } from "./GoogleOAuthField"
import { useSignIn, useSignUp } from "@clerk/nextjs"
import { isClerkAPIResponseError } from "@clerk/nextjs/errors"

interface LoginFormProps {
    setVerifying: Dispatch<SetStateAction<boolean>>
    setIsNewUser: Dispatch<SetStateAction<boolean>>
}

export const LoginForm = (props: LoginFormProps) => {
    const { setVerifying, setIsNewUser } = props
    const { signIn } = useSignIn()
    const { signUp } = useSignUp()

    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const onFormSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const { error: signInError } = await signIn.create({ identifier: email })

            if (!signInError) {
                setVerifying(true)
                await signIn.emailCode.sendCode()
                return
            }

            if (!isClerkAPIResponseError(signInError)) {
                return setError("Something went wrong!")
            }

            if (signInError.errors[0].code !== "form_identifier_not_found") {
                setError(signInError.errors[0].message)
                return
            }

            const { error: signUpError } = await signUp.create({ emailAddress: email })

            if (!signUpError) {
                setIsNewUser(true)
                setVerifying(true)
                await signUp.verifications.sendEmailCode()
                return
            }

            if (!isClerkAPIResponseError(signUpError)) {
                return setError("Something went wrong!");
            }

            return setError(signUpError.errors[0].message);
        } catch {
            return setError("Something went wrong!")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onFormSubmit} className="space-y-4">
            <GoogleOAuthField setError={setError}></GoogleOAuthField>

            <div className="text-center text-xs text-gray-500 uppercase tracking-widest py-2">or</div>

            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f1f3f2] border-2 border-[#ebebeb] p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-300 text-black"
                required
            />

            {error && <p className="text-red-500 text-sm text-center w-full font-medium">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#226aea] text-[#EDEDED] font-semibold py-3 rounded-lg hover:bg-blue-700/97 transition disabled:opacity-50"
            >
                {loading ? "Sending..." : "Continue with email"}
            </button>

            <div id="clerk-captcha" data-cl-theme="dark" />
        </form>
    )
}