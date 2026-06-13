import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type Edge, type Node } from "@xyflow/react"
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

export interface PathMetadata {
    cost : number
    previous : string
}

export const getShortestPathEdges = (table : Record<string, PathMetadata> , endNode : string) => {
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

export const saveGraph = async (email: string | undefined, currentGraph: string, nodes?: Node[], edges?: Edge[]) => {
    if (!email) return "Please wait for clerk to load!"

    const { success, error } = await updateGraphDetails(email, currentGraph, nodes, edges)

    if (!success) return error

    return null
}