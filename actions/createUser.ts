"use server"

import { createClient } from "@supabase/supabase-js"
import { doesUserExist } from "./doesUserExist"
import { DbActionResponse } from "@/lib/types"


export const createUser = async (email : string | undefined) : Promise<DbActionResponse> => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const { success , error , result : userExists } = await doesUserExist(email)

    if (!success) return { success : false , error }

    if (success && userExists) return { success : true, error : "" }

    const supabase = createClient(url , key)
    const { error: insertError } = await supabase.from("users").insert([{email: email}])

    if (insertError) {
        return { success : false , error : insertError.message }
    } else {
        return { success : true , error : "" }
    }

}