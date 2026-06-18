"use server"

import { createClient } from "@/lib/supabase/server"
import { DbActionResponse } from "@/lib/types"
import { auth } from "@clerk/nextjs/server"


export const createUser = async (email: string) : Promise<DbActionResponse> => {
    const {isAuthenticated} = await auth()

    if (!isAuthenticated) return { success: false, error: "Unauthorized!" }

    const supabase = await createClient()
    const { data , error } = await supabase.from("users").select("email").eq("email", email).maybeSingle()
    
    if (error) return { success : false , error : error.message }
    if (data) return { success: true, error: "" }

    const { error: insertError } = await supabase.from("users").insert([{email: email}])

    if (insertError) {
        return { success : false , error : insertError.message }
    } else {
        return { success : true , error : "" }
    }

}