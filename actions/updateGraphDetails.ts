"use server"

import { createClient } from "@supabase/supabase-js"
import { doesUserExist } from "./doesUserExist"
import { Edge, Node } from "@xyflow/react"
import { DbActionResponse } from "@/lib/types"

export const updateGraphDetails = async (
    email: string | undefined, 
    graphName: string, 
    nodes?: Node[], 
    edges?: Edge[]
): Promise<DbActionResponse> => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const { success, error } = await doesUserExist(email)
    if (!success) return { success: false, error: error }

    const updates: { nodes?: Node[], edges?: Edge[] } = {}
    if (nodes !== undefined) updates.nodes = nodes
    if (edges !== undefined) updates.edges = edges

    if (nodes === undefined && edges === undefined) {
        return { success: false, error: "Provide either nodes or edges for update" }
    }

    const supabase = createClient(url, key)
    const { error: updateError } = await supabase
        .from("graphs")
        .update(updates)
        .eq("name", graphName)
        .eq("users.email", email)
        .select("users!inner(id)")

    if (updateError) {
        return { success: false, error: updateError.message }
    } else {
        return { success: true, error: "" }
    }
}