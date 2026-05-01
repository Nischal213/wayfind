import { SignIn } from "@clerk/nextjs"

export const LoginCard = () => {
  return (
    <div className="flex w-[50%] justify-center items-center bg-[#262624]">
        <SignIn></SignIn>
    </div>
  )
}