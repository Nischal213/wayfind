"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { InfoIcon, CircleAlertIcon, XIcon, Loader2Icon, Check } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <Check className="stroke-3 size-5 p-1 text-white bg-green-500 rounded-full" />,
        info: <InfoIcon className="size-4" />,
        warning: <CircleAlertIcon className="[&_circle]:stroke-0 stroke-[2.5] size-5 text-white bg-amber-500 rounded-full" />,
        error: <XIcon className="stroke-3 size-5 p-1 text-white bg-red-500 rounded-full" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }