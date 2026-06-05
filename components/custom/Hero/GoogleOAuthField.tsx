import { useSignIn } from "@clerk/nextjs"
import Image from "next/image"
import { Dispatch, SetStateAction } from "react"

interface GoogleOAuthField {
    setError: Dispatch<SetStateAction<string>>
}

export const GoogleOAuthField = (props: GoogleOAuthField) => {
    const { setError } = props
    const { signIn } = useSignIn()

    const useGoogleOauth = async () => {
        const { error: ssoError } = await signIn.sso({
            strategy: "oauth_google",
            redirectCallbackUrl: "/sso-callback",
            redirectUrl: "/dashboard"
        })

        if (ssoError) return setError(ssoError.code)
    }

    return (
        <button
            type="button"
            onClick={useGoogleOauth}
            className="w-full flex items-center justify-center gap-2 bg-transparent border border-white/20 py-3 rounded-lg hover:bg-white/5 transition"
        >
            <Image
                src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                width={20}
                height={20}
                alt="Google">
            </Image>
            Continue with Google
        </button>
    )
}