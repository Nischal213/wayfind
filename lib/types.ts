import { type Node, type Edge } from "@xyflow/react"
import { Dispatch, ReactNode, SetStateAction } from "react"

type input = "Node1" | "Node2" | "Cost"

export interface ToolsDialogBoxField {
    Node1: string
    Node2: string
    Cost: string
}

export interface ToolsDialogBoxProps {
    title: string
    description: string
    btnName: string
    btnColor?: string
    icon: ReactNode
    inputsToCreate: input[]
    action: (field: ToolsDialogBoxField) => Promise<string | null>
}

export interface UtilsDialogBoxProps {
    title: string
    description: string
    btnName: string
    btnColor?: string
    icon: ReactNode
    inputName: string
    action: (graphName: string) => Promise<string | null>
}

export interface WhiteboardProps {
    nodes: Node[]
    setNodes: Dispatch<SetStateAction<Node[]>>
    edges: Edge[]
    setEdges: Dispatch<SetStateAction<Edge[]>>
    currentGraph: string
}

export interface GeminiNodes {
    id: string
    label: string
}

export interface GeminiEdges {
    source: string
    target: string
    cost: string
}

export interface DeleteGeminiEdges {
    source: string
    target: string
}

type GeminiActions = "create" | "delete" | "mixed"

export interface GeminiResponse {
    valid: boolean
    action: GeminiActions
    nodes: GeminiNodes[]
    edges: GeminiEdges[]
    deleteNodes: string[]
    deleteEdges: DeleteGeminiEdges[]
}

export interface DbQueryResponse<T> {
    success: boolean,
    error: string,
    result: T
}

export interface DbActionResponse {
    success: boolean,
    error: string
}