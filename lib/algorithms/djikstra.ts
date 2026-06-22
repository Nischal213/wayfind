import { Node, Edge } from "@xyflow/react"
import { getShortestPathEdges, PathMetadata } from "../utils"
import { MinPriorityQueue } from "@datastructures-js/priority-queue"

interface NeighborNode {
    name : string,
    distance : number
}

export const djikstra = (nodes : Node[] , edges: Edge[] , startNode : string , endNode : string) => { 
    const neighborsTable : Record<string , NeighborNode[]> = {}

    nodes.forEach((node) => neighborsTable[node.id] = [])

    edges.forEach((edge) => {
        neighborsTable[edge.source]!.push({ name : edge.target , distance : Number(edge.label) })
    })

    const djisktraTable : Record<string, PathMetadata> = {}

    nodes.forEach((node) => node.id === startNode ? 
    djisktraTable[node.id] = { cost: 0 , previous: "" } : 
    djisktraTable[node.id] = { cost: Infinity , previous: ""}
    )

    const priorityQueue = new MinPriorityQueue<NeighborNode>({
        compare: (a : NeighborNode, b: NeighborNode) => a.distance - b.distance
    })

    const visitedSet = new Set<string>

    priorityQueue.enqueue({ name: startNode , distance: 0 })

    while (priorityQueue.size()) {
        const currentNode = priorityQueue.dequeue()!
        const currentNodeName = currentNode.name

        if (!visitedSet.has(currentNodeName)) {
            visitedSet.add(currentNodeName)

            neighborsTable[currentNodeName]!.forEach((neighbor) => {
                const totalDistance = djisktraTable[currentNodeName]!.cost + neighbor.distance
                const neighborEntry = djisktraTable[neighbor.name]!

                if (totalDistance < neighborEntry.cost) {
                    neighborEntry.cost = totalDistance
                    neighborEntry.previous = currentNodeName
                    priorityQueue.enqueue({ name: neighbor.name, distance: totalDistance })
                }
            })
        }
    }

    return getShortestPathEdges(djisktraTable, endNode)
}