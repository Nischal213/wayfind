import { SignIn } from "@clerk/nextjs"

export const LoginCard = () => {
  return (
    <div className="flex w-[50%] justify-center items-center bg-[#262624]">
      <SignIn appearance={{
        variables: {
          colorPrimary: "#2563eb",
          colorNeutral: "#30302E",
          colorForeground: "#EDEDED",
          colorBackground: "#30302E",
          colorInputForeground: "#EDEDED",
          colorInput: "#454543",
        },
        elements: {
          socialButtonsBlockButton : {
            background: "#454543",
            "&:hover" : {
              background: "#262624"
            }
          },
          socialButtonsBlockButtonText__google: {
            color: '#ededed',
          },
          formButtonPrimary : {
            "&:hover" : {
              background: "#1d4ed8"
            }
          }
        }
        }} />
    </div>
  )
}