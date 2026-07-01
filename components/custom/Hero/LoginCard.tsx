"use client"

import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { OtpCard } from "./OtpCard";

export const LoginCard = () => {
  const [verifying, setVerifying] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)

  return (
    <div className="bg-[#F8F8F8] p-8 rounded-2xl w-[60%] shadow-lg/15">
      <h1 className="text-6xl tracking-wider text-blue-600 font-semibold font-dancing-script text-center mb-10"> Wayfind </h1>

      {!verifying ? (
        <LoginForm setVerifying={setVerifying} setIsNewUser={setIsNewUser}></LoginForm>
      ) : (
        <OtpCard setVerifying={setVerifying} isNewUser={isNewUser}></OtpCard>
      )}

    </div>
  )
}