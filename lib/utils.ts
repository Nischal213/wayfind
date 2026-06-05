import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { GeminiEdges, GeminiNodes } from "./types"
import { MarkerType, XYPosition, type Edge, type Node } from "@xyflow/react"
import { MinPriorityQueue } from '@datastructures-js/priority-queue'
import { updateGraphDetails } from "@/actions/updateGraphDetails"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isAlphanumerical = (str : string) => {
  return /^[a-zA-Z0-9]+$/.test(str)
}

export const capitalizeWord = (text: string) =>  {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export const normalizeNodes = (
    nodes: Node[], 
    geminiNodes: GeminiNodes[], 
    screenToFlowPosition: (clientPosition: XYPosition) => XYPosition) => {

    const nodesSet = new Set(nodes.map((node) => node.data.label))
    geminiNodes = geminiNodes.filter((gNodes) => !nodesSet.has(gNodes.label))

    return geminiNodes.map((gNodes) => {
        const nodeX = window.innerWidth / 2 + (Math.random() - 0.5) * 100
        const nodeY = window.innerHeight / 2 + (Math.random() - 0.5) * 100

        const nodePosition = screenToFlowPosition({
            x: nodeX,
            y: nodeY
        })

        const normalNode : Node = {
            id : gNodes.id,
            type : "custom",
            data : { label : gNodes.label },
            position: nodePosition
        }

        return normalNode
    })
}

export const normalizeEdges = (edges : Edge[] , geminiEdges : GeminiEdges[]) => {
  const edgesRecord : Record<string , Edge> = Object.fromEntries(
    edges.map((edge) => [edge.id , edge])
  )

  return geminiEdges.map((gEdges) => {
    const id = `${gEdges.source}-${gEdges.target}`
    const reverseExists = `${gEdges.target}-${gEdges.source}` in edgesRecord
    const edgeExists = edgesRecord[id]

    if (edgeExists) {
      const updatedEdge : Edge = {...edgeExists , label : gEdges.cost}
      edgesRecord[id] = updatedEdge

      return updatedEdge
    }

    const normalEdge : Edge = {
      id : id,
      source : gEdges.source,
      target : gEdges.target,
      label : gEdges.cost,
      type: "smoothstep",
      sourceHandle: reverseExists ? "bottom" : "top",
      targetHandle: reverseExists ? "bottom" : "top",
      zIndex : 0,
      style : {
        stroke : `#b1b1b7`
      },
      markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#b1b1b7',
      }
    }

    edgesRecord[id] = normalEdge
    return normalEdge
  })
}

interface NeighborNode {
    name : string,
    distance : number
}

interface PathMetadata {
    cost : number
    previous : string
}

const getShortestPathEdges = (table : Record<string, PathMetadata> , endNode : string) => {
    const edgeIds = new Set<string>()

    let childNode = endNode
    let parentNode = table[childNode]!.previous

    while (parentNode !== "") {
        edgeIds.add(`${parentNode}-${childNode}`)
        childNode = parentNode
        parentNode = table[childNode]!.previous
    }

    return edgeIds
}

export const djikstra = (nodes : Node[] , edges: Edge[] , startNode : string , endNode : string) => { 
    const neighborsTable : Record<string , NeighborNode[]> = {}

    nodes.forEach((edge) => neighborsTable[edge.id] = [])

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


export const saveGraph = async (email: string | undefined, currentGraph: string, nodes?: Node[], edges?: Edge[]) => {
    if (!email) return "Please wait for clerk to load!"

    const { success, error } = await updateGraphDetails(email, currentGraph, nodes, edges)

    if (!success) return error

    return null
}