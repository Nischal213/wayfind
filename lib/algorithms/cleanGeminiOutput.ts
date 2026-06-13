import { Node, Edge, XYPosition, MarkerType } from "@xyflow/react"
import { GeminiEdges, GeminiNodes } from "../types"

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