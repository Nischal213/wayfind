"use server"

import { createClient } from "@supabase/supabase-js"
import { doesGraphAlreadyExist } from "./doesGraphAlreadyExist"
import { doesUserExist } from "./doesUserExist"
import { DbActionResponse } from "@/lib/types"

export const deleteGraph = async (email: string, graphName: string) : Promise<DbActionResponse> => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const { success, error, result: userExists } = await doesUserExist(email)

    if (!success) return { success: false , error: error }
    if (success && !userExists) return { success: false, error: "Please wait for clerk to verify you!" }
    
    const { success: gSuccess, error: gError, result: graphExists } = await doesGraphAlreadyExist(email , graphName)
    
    if (!gSuccess) return { success: false, error: gError }
    if (gSuccess && !graphExists) return { success: false, error: "This graph doesn't exist!"}

    const supabase = createClient(url , key)
    const { error: deleteError } = await supabase
        .from("graphs")
        .delete()
        .select("users!inner(id)")
        .eq("users.email", email)
        .eq("name", graphName)

    if (deleteError) {
        return { success: false, error: deleteError.message }
    } else {
        return { success: true, error: "" }
    }

}