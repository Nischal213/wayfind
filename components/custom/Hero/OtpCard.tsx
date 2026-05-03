"use client"

import { useRef, useState } from "react"

interface OtpCardProp {
    email : string
    error : string
    loading : boolean
    onOtpComplete : (code : string) => Promise<void>
    onChangeEmail : () => void
}

export const OtpCard = (props : OtpCardProp) => {
    const [code, setCode] = useState("")
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    const { email , error , loading , onOtpComplete , onChangeEmail } = props
    
    const onOtpInput = async (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = code.split("");
        newCode[index] = value.slice(-1);
        const updated = newCode.join("");
        setCode(updated);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        if (updated.length === 6 && updated.split("").every((c) => c)) {
            onOtpComplete(updated);
        }
    }
    
      const onOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      }
    
      const onOtpPaste = async (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length !== 6) return;
    
        setCode(pasted);
        pasted.split("").forEach((char, i) => {
          if (inputRefs.current[i]) inputRefs.current[i]!.value = char;
        })
        inputRefs.current[5]?.focus();
        onOtpComplete(pasted);
      }
    
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white text-center">Check your email</h2>
          <p className="text-sm text-gray-400 text-center">We sent a code to {email}</p>
    
          <div className="flex gap-2 justify-center" onPaste={onOtpPaste}>
            {Array.from({ length: 6 }).map((_, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={code[i] ?? ""}
                onChange={(e) => onOtpInput(i, e.target.value)}
                onKeyDown={(e) => onOtpKeyDown(i, e)}
                disabled={loading}
                className="w-11 h-14 text-center text-xl font-semibold bg-[#2a2a2a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-white/30 disabled:opacity-50"
              />
            ))}
          </div>
    
          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          {loading && <p className="text-gray-400 text-xs text-center">Verifying...</p>}
    
          <button
            type="button"
            onClick={onChangeEmail}
            className="w-full text-xs text-gray-500 hover:underline"
          >
            Use a different email
          </button>
        </div>
      )
}