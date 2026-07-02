"use client"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useSignIn, useSignUp } from "@clerk/nextjs"
import { isClerkAPIResponseError } from "@clerk/nextjs/errors"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useState } from "react"

interface OtpCard {
    isNewUser: boolean
    setVerifying: Dispatch<SetStateAction<boolean>>
}

export const OtpCard = (prop: OtpCard) => {
    const { isNewUser, setVerifying } = prop
    const { signIn } = useSignIn()
    const { signUp } = useSignUp()
    const router = useRouter()
    const [error, setError] = useState("")
    const [value, setValue] = useState("")

    const onChange = async (value: string) => {
        setValue(value)
        setError("")

        if (value.length < 6) return

        if (isNewUser) {
            const { error: signUpOtpError } = await signUp.verifications.verifyEmailCode({ code: value })

            if (!signUpOtpError) {
                await signUp.finalize({
                    navigate: ({ session, decorateUrl }) => {
                        if (session?.currentTask) return
                        const url = decorateUrl('/dashboard')

                        if (url.startsWith('http')) {
                            window.location.href = url
                        } else {
                            router.push(url)
                        }
                    }
                })
                return
            }

            const errMsg = isClerkAPIResponseError(signUpOtpError) && signUpOtpError.errors[0].code === "form_code_incorrect"
                ? "Incorrect verification code!"
                : "Something went wrong!"

            return setError(errMsg)
        } else {
            const { error: signInOtpError } = await signIn.emailCode.verifyCode({ code: value })

            if (!signInOtpError) {
                await signIn.finalize({
                    navigate: ({ session, decorateUrl }) => {
                        if (session?.currentTask) return
                        const url = decorateUrl('/dashboard')

                        if (url.startsWith('http')) {
                            window.location.href = url
                        } else {
                            router.push(url)
                        }
                    }
                })
                return
            }

            const errMsg = isClerkAPIResponseError(signInOtpError) && signInOtpError.errors[0].code === "form_code_incorrect"
                ? "Incorrect verification code!"
                : "Something went wrong!"

            setError(errMsg)
            return
        }
    }

    const onChangeEmail = () => {
        setVerifying(false)
        setError("")

        if (isNewUser) {
            signUp.reset()
        } else {
            signIn.reset()
        }
    }

    return (
        <div className="flex flex-col items-center gap-y-5 text-black">
            <InputOTP maxLength={6} value={value} onChange={onChange}>
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>

            {error && <p className="text-red-500 text-sm text-center w-full font-medium">{error}</p>}

            <button
                type="button"
                onClick={onChangeEmail}
                className="w-full text-sm text-gray-500 hover:underline cursor-pointer"
            >
                Use a different email
            </button>
        </div>
    )
}
