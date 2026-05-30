import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { GeminiEdges, GeminiNodes } from "./types"
import { MarkerType, type Edge, type Node } from "@xyflow/react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isAlphanumerical = (str : string) => {
  return /^[a-zA-Z0-9]+$/.test(str)
}

export const capitalizeWord = (text: string) =>  {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export const normalizeNodes = (nodes : Node[] , geminiNodes : GeminiNodes[]) => {
  const nodesSet = new Set(nodes.map((node) => node.data.label))
  geminiNodes = geminiNodes.filter((gNodes) => !nodesSet.has(gNodes.label))

  return geminiNodes.map((gNodes) => {
    const normalNode : Node = {
      id : gNodes.id,
      type : "custom",
      data : { label : gNodes.label },
      position: {
          x: Math.random() * 400 - 200, 
          y: Math.random() * 300 + 50
      }
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
      const updatedEdge : Edge = {...edgeExists , label : gEdges.distance}
      edgesRecord[id] = updatedEdge

      return updatedEdge
    }

    const normalEdge : Edge = {
      id : id,
      source : gEdges.source,
      target : gEdges.target,
      label : gEdges.distance,
      type: "smoothstep",
      sourceHandle: reverseExists ? "bottom" : "top",
      targetHandle: reverseExists ? "bottom" : "top",
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