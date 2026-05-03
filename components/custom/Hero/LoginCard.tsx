"use client"

import { useAuth } from "@/hooks/useAuth";
import { EmailForm } from "./EmailForm";
import { OtpCard } from "./OtpCard";

export const LoginCard = () => {
    const { 
        email, verifying, error, loading, isLoaded,
        onEmailSubmit, onOtpComplete, onGoogleSumbit, onChangeEmail 
    } = useAuth()
    
    if (!isLoaded) {
        return (
            <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/10 w-full max-w-md h-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white" />
            </div>
        )
    }

    return (
        <div className="bg-[#1a1a1a] p-8 rounded-2xl ...">
          <div id="clerk-captcha" className="hidden" />
          {!verifying ? (
            <EmailForm 
              error={error} 
              loading={loading} 
              onEmailSubmit={onEmailSubmit} 
              onGoogleSumbit={onGoogleSumbit} 
            />
          ) : (
            <OtpCard 
              email={email} 
              error={error}
              loading={loading} 
              onOtpComplete={onOtpComplete} 
              onChangeEmail={onChangeEmail} 
            />
          )}
        </div>
    )
}