"use server"

import { DbQueryResponse } from "@/lib/types"
import { createClient } from "@supabase/supabase-js"

export const doesUserExist = async (email : string | undefined) : Promise<DbQueryResponse<boolean>> => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!email) return { success : false , error : "Email is somehow undefined" , result : false}
    if (!url || !key) return { success : false , error : "Make sure api keys in .env.local are valid" , result : false}

    const supabase = createClient(url , key)
    const { data , error } = await supabase.from("users").select("email").eq("email" , email).maybeSingle()

    if (error) return { success : false , error : error.message , result : false }

    if (data) {
        return { success : true , error : "" , result : true }
    } else {
        return { success : true , error : "" , result : false}
    }

}