"use server"

import { createClient } from "@/lib/supabase/server"
import { DbQueryResponse } from "@/lib/types"
import { auth } from "@clerk/nextjs/server"

interface RecentGraphsResponse {
    graphs: { name: string }[]
}

export const getUserRecentGraphs = async (email: string): Promise<DbQueryResponse<RecentGraphsResponse>> => {
    const { isAuthenticated } = await auth()

    if (!isAuthenticated) return { success: false, error: "Unauthorized!", result: { graphs: [] } }

    const supabase = await createClient()
    const { data, error: gError } = await supabase
        .from("users")
        .select("graphs!inner(name)")
        .eq("email", email)
        .order("created_at", { referencedTable: "graphs", ascending: false })
        .single()

    if (gError) {
        return { success: false, error: gError.message, result: { graphs: [] } }
    } else {
        return { success: true, error: "", result: data }
    }


}