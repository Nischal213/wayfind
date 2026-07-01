import { Node, Edge, XYPosition, MarkerType } from "@xyflow/react"
import { GeminiEdges, GeminiNodes } from "../types"
import { isReserved, isNameValid } from "../utils"

export const normalizeNodes = (
  nodes: Node[],
  geminiNodes: GeminiNodes[],
  screenToFlowPosition: (clientPosition: XYPosition) => XYPosition) => {

  const nodesLabelSet = new Set(nodes.map((node) => node.data.label))
  const nodesIdSet = new Set(nodes.map((node) => node.id))
  geminiNodes = geminiNodes.filter((gNodes) =>
    isNameValid(gNodes.label) && (!isReserved(gNodes.label) || !nodesLabelSet.has(gNodes.label)) && !nodesIdSet.has(gNodes.id)
  )

  return geminiNodes.map((gNodes) => {
    const nodeX = window.innerWidth / 2 + (Math.random() - 0.5) * 100
    const nodeY = window.innerHeight / 2 + (Math.random() - 0.5) * 100

    const nodePosition = screenToFlowPosition({
      x: nodeX,
      y: nodeY
    })

    const normalNode: Node = {
      id: gNodes.id,
      type: "custom",
      data: { label: gNodes.label },
      position: nodePosition
    }

    return normalNode
  })
}

export const normalizeEdges = (edges: Edge[], geminiEdges: GeminiEdges[]) => {
  const edgesRecord: Record<string, Edge> = Object.fromEntries(
    edges.map((edge) => [edge.id, edge])
  )

  return geminiEdges
    .filter((gEdges) => {
      const edgeReserved = !isReserved(gEdges.source) || !isReserved(gEdges.target)
      const edgeValid = isNameValid(gEdges.source) || isNameValid(gEdges.target)

      return edgeReserved || edgeValid
    })
    .map((gEdges) => {
      const id = `${gEdges.source}-${gEdges.target}`
      const reverseEdge = edgesRecord[`${gEdges.target}-${gEdges.source}`]
      const edgeExists = edgesRecord[id]

      if (edgeExists) {
        const updatedEdge: Edge = { ...edgeExists, label: gEdges.cost }
        edgesRecord[id] = updatedEdge

        return updatedEdge
      }

      const normalEdge: Edge = {
        id: id,
        source: gEdges.source,
        target: gEdges.target,
        label: gEdges.cost,
        type: "smoothstep",
        sourceHandle: reverseEdge?.sourceHandle === "top" ? "bottom" : "top",
        targetHandle: reverseEdge?.targetHandle === "top" ? "bottom" : "top",
        zIndex: 0,
        style: {
          stroke: `#b1b1b7`
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