import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  return (
    <div className="flex items-center justify-center h-dvh bg-[#F8F8F8]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-neutral-700" />
        <p className="text-sm text-neutral-700">Signing you in...</p>
      </div>
      <AuthenticateWithRedirectCallback />
      <div id="clerk-captcha" data-cl-theme="dark" />
    </div>
  );
}