"use server"

import { createClient } from "@/lib/supabase/server"
import { DbActionResponse } from "@/lib/types"
import { auth } from "@clerk/nextjs/server"

export const deleteGraph = async (email: string, graphName: string): Promise<DbActionResponse> => {
    const { isAuthenticated } = await auth()

    if (!isAuthenticated) return { success: false, error: "Unauthorized!" }

    const supabase = await createClient()
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