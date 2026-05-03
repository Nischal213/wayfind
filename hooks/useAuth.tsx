import { useSignIn, useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface ClerkErrorResponse {
    code? : string
    message? : string
}

interface ClerkError {
    errors : ClerkErrorResponse[]
}

interface useAuthResponse {
    email : string
    verifying : boolean
    error : string
    loading : boolean
    isLoaded : boolean
    onEmailSubmit : (email : string) => Promise<void>
    onOtpComplete : (code : string) => Promise<void>
    onGoogleSumbit : () => void
    onChangeEmail : () => void
}

export function useAuth() : useAuthResponse {
    const { signIn , isLoaded : isSignInReady , setActive: setSignInActive } = useSignIn()
    const { signUp , isLoaded : isSignUpReady , setActive: setSignUpActive } = useSignUp()
    const router = useRouter()
    
    const [email, setEmail] = useState("")
    const [verifying, setVerifying] = useState(false)
    const [isNewUser, setIsNewUser] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    
        
    function isClerkError(err : unknown) : err is ClerkError {
        return (
            typeof err === "object" &&
            err !== null &&
            "errors" in err
        )
    }
    
    const onEmailSubmit = async (userEmail : string) => {
        // Only undefined if clerk hasn't loaded
        if (!signIn || !signUp) return

        setError("")
        setLoading(true)
        setEmail(userEmail)

        try {
            const { supportedFirstFactors } = await signIn.create({identifier: userEmail})
            const emailFactor = supportedFirstFactors!.find( (i) => i.strategy === "email_code")

            if (emailFactor && "emailAddressId" in emailFactor) {
                await signIn.prepareFirstFactor({
                    strategy : "email_code",
                    emailAddressId: emailFactor.emailAddressId
                })

                setVerifying(true)
            }
            
        } catch (err) {
            if (isClerkError(err) && err.errors[0].code === "form_identifier_not_found") {
                try {
                    await signUp.create({emailAddress : userEmail})
                    await signUp.prepareEmailAddressVerification({strategy : "email_code"})

                    setIsNewUser(true)
                    setVerifying(true)
                } catch (signUpErr) {
                    if (isClerkError(signUpErr) && signUpErr.errors[0].message) {
                        setError(signUpErr.errors[0].message)
                    } else {
                        setError("Something went wrong!")
                    }
                }
            } else {
                if (isClerkError(err) && err.errors[0].code) {
                    setError(err.errors[0].code)
                } else {
                    setError("Something went wrong!")
                }
            }
        } finally {
            setLoading(false)
        }
    }
    
    const onOtpComplete = async (code : string) => {
        if (!signIn || !signUp) return

        setLoading(true)
        setError("")

        try {
            if (isNewUser) {
                const attempt = await signUp.attemptEmailAddressVerification({ code })
                if (attempt.status === "complete") {
                    await setSignUpActive({ session: attempt.createdSessionId })
                    router.push("/dashboard")
                }
            } else {
                const attempt = await signIn.attemptFirstFactor({ strategy: "email_code", code })
                if (attempt.status === "complete") {
                    await setSignInActive({ session: attempt.createdSessionId })
                    router.push("/dashboard")
                }
            }
        } catch (err) {
            if (isClerkError(err) && err.errors[0].message) {
                setError(err.errors[0].message)
            } else {
                setError("Something went wrong!")
            }
        } finally {
            setLoading(false)
        }
    }
    
    const onGoogleSumbit = () => {
        if (!signIn) return

        signIn.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/dashboard",
        })
    }

    const onChangeEmail = () => {
        setVerifying(false)
        setError("")
    }

    return {
    email,
    verifying,
    error,
    loading,
    isLoaded: isSignInReady && isSignUpReady,
    onEmailSubmit,
    onOtpComplete,
    onGoogleSumbit,
    onChangeEmail,
  };
}