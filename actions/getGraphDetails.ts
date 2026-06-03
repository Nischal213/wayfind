"use server"

import { createClient } from "@supabase/supabase-js"
import { doesUserExist } from "./doesUserExist"
import { Edge, Node } from "@xyflow/react"
import { DbQueryResponse } from "@/lib/types"

interface GraphDetailsResponse {
    nodes: Node[]
    edges: Edge[]
}

export const getGraphDetails = async (email: string, graphName: string) : Promise<DbQueryResponse<GraphDetailsResponse>> => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const { success, error } = await doesUserExist(email)
    if (!success) return { success: false , error: error, result: {nodes:[], edges:[]} }

    const supabase = createClient(url, key)
    const { data , error: gError } = await supabase
        .from("graphs")
        .select(`
            nodes,
            edges,
            users!inner(id)
        `)
        .eq("users.email", email)
        .eq("name", graphName)
        .single()

    if (gError) {
        return { success: false, error: gError.message, result: {nodes:[], edges:[]} }
    } else {
        console.log(data)
        return { success: true, error: "", result: data }
    }
}