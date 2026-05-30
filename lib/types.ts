import { type Node , type Edge } from "@xyflow/react"
import { Dispatch, ReactNode, SetStateAction } from "react"

type input = "Node1" | "Node2" | "Distance"

export interface DialogBoxField {
    Node1 : string
    Node2 : string
    Distance : string
}

export interface DialogBoxProps {
    title : string
    description : string
    btnName : string
    icon : ReactNode
    inputsToCreate : input[]
    action : (field : DialogBoxField) => string | null
}

export interface WhiteboardProps {
    nodes : Node[]
    setNodes : Dispatch<SetStateAction<Node[]>>
    edges : Edge[]
    setEdges : Dispatch<SetStateAction<Edge[]>>
}

export interface GeminiNodes {
    id : string
    label : string
}

export interface GeminiEdges {
    source : string
    target : string
    distance : string
}

export interface DeleteGeminiEdges {
    source : string
    target : string
}

type GeminiActions = "create" | "delete" | "mixed"

export interface GeminiResponse {
    valid : boolean
    action : GeminiActions
    nodes : GeminiNodes[]
    edges : GeminiEdges[]
    deleteNodes : string[]
    deleteEdges : DeleteGeminiEdges[]
}