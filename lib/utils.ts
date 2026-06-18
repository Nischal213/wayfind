import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type Edge, type Node } from "@xyflow/react"
import { updateGraphDetails } from "@/actions/updateGraphDetails"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isNameValid = (str: string) => {
  return /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/.test(str)
}

// Not allowed because chu liu edmonds algorithm use these names internally
export function isReserved(name: string): boolean {
  return name === "dummyRoot" || /^superNode\d+$/.test(name)
}

export const capitalizeWord = (text: string) => {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export interface PathMetadata {
  cost: number
  previous: string
}

export const getShortestPathEdges = (table: Record<string, PathMetadata>, endNode: string) => {
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

export const saveGraph = async (email: string, currentGraph: string, nodes?: Node[], edges?: Edge[]) => {
  const { success, error } = await updateGraphDetails(email, currentGraph, nodes, edges)

  if (!success) return error

  return null
}