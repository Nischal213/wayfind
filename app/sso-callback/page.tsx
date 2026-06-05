import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  return (
    <div className="flex items-center justify-center h-dvh bg-[#1a1a1a]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white" />
        <p className="text-sm text-gray-400">Signing you in...</p>
      </div>
      <AuthenticateWithRedirectCallback />
      <div id="clerk-captcha" data-cl-theme="dark" />
    </div>
  );
}