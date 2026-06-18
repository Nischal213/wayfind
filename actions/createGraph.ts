"use server"

import { createClient } from "@/lib/supabase/server"
import { DbActionResponse } from "@/lib/types"
import { auth } from "@clerk/nextjs/server"

export const createGraph = async (email: string, graphName: string) : Promise<DbActionResponse> => {
    const { isAuthenticated } = await auth()

    if (!isAuthenticated) return { success: false, error: "Unauthorized!" }

    const supabase = await createClient()
    const { data: userData , error: idError } = await supabase.from("users").select().eq("email", email).single()

    if (idError) return { success: false , error: idError.message }

    const { error: insertError } = await supabase.from("graphs").insert([{
        name: graphName,
        nodes: [],
        edges: [],
        user_id: userData.id
    }])

    if (insertError) return { success: false , error: insertError.message }

    return { success: true , error: "" }
}