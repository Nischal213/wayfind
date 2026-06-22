"use server"

import { createClient } from "@/lib/supabase/server"
import { Edge, Node } from "@xyflow/react"
import { DbActionResponse } from "@/lib/types"
import { auth } from "@clerk/nextjs/server"

export const updateGraphDetails = async (
    email: string,
    graphName: string,
    nodes?: Node[],
    edges?: Edge[]
): Promise<DbActionResponse> => {

    const { isAuthenticated } = await auth()

    if (!isAuthenticated) return { success: false, error: "Unauthorized!" }

    const updates: { nodes?: Node[], edges?: Edge[] } = {}
    if (nodes !== undefined) updates.nodes = nodes
    if (edges !== undefined) updates.edges = edges

    if (nodes === undefined && edges === undefined) {
        return { success: false, error: "Provide either nodes or edges for update" }
    }

    const supabase = await createClient()
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