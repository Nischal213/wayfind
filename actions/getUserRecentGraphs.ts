"use server"

import { createClient } from "@supabase/supabase-js"
import { doesUserExist } from "./doesUserExist"
import { DbQueryResponse } from "@/lib/types"

interface RecentGraphsResponse {
    graphs : { name: string }[]
}

export const getUserRecentGraphs = async (email: string) : Promise<DbQueryResponse<RecentGraphsResponse>> => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const { success, error } = await doesUserExist(email)
    
    if (!success) return { success: false, error: error, result: {graphs: []} }

    const supabase = createClient(url , key)
    const { data , error: gError } = await supabase
        .from("users")
        .select("graphs!inner(name)")
        .eq("email", email)
        .order("created_at", { referencedTable: "graphs", ascending: false })
        .single()

    console.log("Backend: ", data)

    if (gError) {
        return { success: false, error: error, result: {graphs: []} }
    } else {
        return { success: true, error: "", result: data }
    }


}