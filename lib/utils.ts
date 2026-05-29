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

export const excludeExistingNodes = (nodes : Node[] , geminiNodes : GeminiNodes[]) => {
  const nodesSet = new Set(nodes.map((node) => node.data.label))

  return geminiNodes.filter((gNodes) => !nodesSet.has(gNodes.label))
}

export const normalizeNodes = (geminiNodes : GeminiNodes[]) => {
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

export const normalizeEdges = (edges : Edge[], geminiEdges : GeminiEdges[]) => {
  const edgesSet = new Set(edges.map((edges) => edges.id))

  return geminiEdges.map((gEdges) => {
    const newId = `${gEdges.source}-${gEdges.target}`
    const reverseExists = edgesSet.has(`${gEdges.target}-${gEdges.source}`)
    const edgeExists = edgesSet.has(newId)

    if (edgeExists) {
      const targetEdge : Edge = edges.find((edge) => edge.id === newId)!
      const updatedEdge : Edge = {...targetEdge , label : gEdges.distance}

      edgesSet.add(newId)
      return updatedEdge
    }

    const normalEdge : Edge = {
      id : newId,
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

    edgesSet.add(newId)

    return normalEdge
  })
}