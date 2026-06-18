"use server"

import { createClient } from "@/lib/supabase/server"
import { Edge, Node } from "@xyflow/react"
import { DbQueryResponse } from "@/lib/types"
import { auth } from "@clerk/nextjs/server"

interface GraphDetailsResponse {
    nodes: Node[]
    edges: Edge[]
}

export const getGraphDetails = async (email: string, graphName: string) : Promise<DbQueryResponse<GraphDetailsResponse>> => {
    const { isAuthenticated } = await auth()

    if (!isAuthenticated) return { success: false, error: "Unauthorized!", result: {nodes:[], edges:[]} }

    const supabase = await createClient()
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
        return { success: true, error: "", result: data }
    }
}