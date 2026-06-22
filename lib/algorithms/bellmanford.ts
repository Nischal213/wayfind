import { Node, Edge } from "@xyflow/react"
import { getShortestPathEdges, PathMetadata } from "../utils"

export const bellmanford = (nodes : Node[] , edges : Edge[], startNode : string , endNode : string) => {
    const bellmanfordTable : Record<string , PathMetadata> = {}

    nodes.forEach((node) => 
        node.id === startNode ? 
        bellmanfordTable[node.id] = {cost : 0 , previous : ""}:
        bellmanfordTable[node.id] = {cost : Infinity, previous : ""}
    )

    for (let i = 0 ; i < nodes.length - 1; i++) {
        let changes = false

        edges.forEach((edge) => {
            const sourceCost = bellmanfordTable[edge.source]!.cost
            const totalDistance = sourceCost + Number(edge.label)
            const targetEntry = bellmanfordTable[edge.target]!

            if (sourceCost !== Infinity && totalDistance < targetEntry.cost) {
                targetEntry.cost = totalDistance
                targetEntry.previous = edge.source
                changes = true
            }
        })

        if (!changes) {
            break
        }
    }
    
    return getShortestPathEdges(bellmanfordTable , endNode)
}