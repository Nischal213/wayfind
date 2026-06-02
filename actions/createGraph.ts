"use server"

import { createClient } from "@supabase/supabase-js"
import { doesUserExist } from "./doesUserExist"
import { DbActionResponse } from "@/lib/types"
import { doesGraphAlreadyExist } from "./doesGraphAlreadyExist"

export const createGraph = async (email: string, graphName: string) : Promise<DbActionResponse> => {

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const { success , error , result : userExists } = await doesUserExist(email)

    if (!success) return { success: false, error }
    if (success && !userExists) return { success: false, error: "Please wait for clerk to verify you!" }

    const { success: gSuccess , error: gError , result: graphExists } = await doesGraphAlreadyExist(email , graphName)

    if (!gSuccess) return { success: false, error: gError }
    if (gSuccess && graphExists) return { success: false, error: "This graph already exists!"}

    const supabase = createClient(url , key)
    const { data: userData , error: idError } = await supabase.from("users").select().eq("email", email).single()

    if (idError) return { success: false , error: idError.message }

    const { error: insertError } = await supabase.from("graphs").insert([{
        name: graphName,
        nodes: [{}],
        edges: [{}],
        user_id: userData.id
    }])

    if (insertError) return { success: false , error: insertError.message }

    return { success: true , error: "" }
}