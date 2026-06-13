import { MarkerType, type Node, type Edge, useReactFlow } from "@xyflow/react"
import { ToolsDialogBox } from "@/components/common/ToolsDialogBox"
import { ChartNetwork, CircleMinus, CirclePlus, Spline, SplinePointer } from "lucide-react"
import { ToolsDialogBoxField, ToolsDialogBoxProps, WhiteboardProps } from "@/lib/types"
import { isAlphanumerical, capitalizeWord, saveGraph } from "@/lib/utils"
import { useClerk } from "@clerk/nextjs"
import { bellmanford } from "@/lib/algorithms/bellmanford"
import { djikstra } from "@/lib/algorithms/djikstra"
import { kruskal } from "@/lib/algorithms/kruskal"


export const Tools = (props: WhiteboardProps) => {
    const { nodes, setNodes, edges, setEdges, currentGraph } = props
    const { screenToFlowPosition } = useReactFlow()
    const { user } = useClerk()
    const userEmail = user?.primaryEmailAddress?.emailAddress

    const doesNodeExist = (fieldNode: string) => {
        if (nodes.length == 0) {
            return false
        }

        const findNode = nodes.some((node) => {
            return node.id === fieldNode.toLowerCase()
        })

        return findNode
    }

    const getNodeId = (fieldNode: string) => {
        if (nodes && nodes.length > 0) {
            const targetNode = nodes.find((node) => node.id === fieldNode.toLowerCase())

            if (targetNode) {
                return targetNode.id
            }
        }
        throw new Error("Something went wrong. Go debug it.")
    }

    const addNode = async (field: ToolsDialogBoxField): Promise<string | null> => {
        if (!field.Node1) {
            return "Node names can't be empty!"
        }

        if (!isAlphanumerical(field.Node1)) {
            return "Node names must consist of letters or numbers only!"
        }

        if (doesNodeExist(field.Node1)) {
            return "Node names must be unique!"
        }

        const nodeX = window.innerWidth / 2 + (Math.random() - 0.5) * 100
        const nodeY = window.innerHeight / 2 + (Math.random() - 0.5) * 100

        const nodePosition = screenToFlowPosition({
            x: nodeX,
            y: nodeY
        })

        const newNode: Node = {
            id: `${field.Node1.toLowerCase()}`,
            type: "custom",
            data: { label: capitalizeWord(field.Node1) },
            position: nodePosition
        }

        const save = [...nodes, newNode]
        const error = await saveGraph(userEmail, currentGraph, save, undefined)

        if (error) return error

        setNodes(save)
        return null
    }

    const addNodeProp: ToolsDialogBoxProps = {
        title: "Add node",
        description: "Use the chatbox if you want to add multiple nodes quickly!",
        btnName: "Add node",
        icon: <CirclePlus size={18} />,
        inputsToCreate: ["Node1"],
        action: addNode
    }

    const removeNode = async (field: ToolsDialogBoxField): Promise<string | null> => {
        const node1 = field.Node1.toLowerCase()

        if (doesNodeExist(field.Node1)) {
            const save1 = nodes.filter((node) => node.data.label !== capitalizeWord(node1))
            const save2 = edges.filter((edge) => edge.target !== node1 && edge.source !== node1)
            const error = await saveGraph(
                userEmail,
                currentGraph,
                save1,
                save2
            )

            if (error) return error

            setNodes(save1)
            setEdges(save2)
            return null
        } else {
            return "That node doesn't exist!"
        }
    }

    const removeNodeProp: ToolsDialogBoxProps = {
        title: "Remove node",
        description: "To delete multiple items quickly, hold Shift and drag a selection box around them, then press Backspace!",
        btnName: "Remove node",
        icon: <CircleMinus size={18} />,
        inputsToCreate: ["Node1"],
        action: removeNode
    }

    const addEdge = async (field: ToolsDialogBoxField): Promise<string | null> => {
        const node1 = field.Node1.toLowerCase()
        const node2 = field.Node2.toLowerCase()
        const cost = field.Cost

        if (nodes.length <= 1) {
            return "Can't make an edge when there's less than one node!"
        }

        if (!doesNodeExist(node1)) {
            return "First node given doesn't exist!"
        }

        if (!doesNodeExist(node2)) {
            return "Second node given doesn't exist!"
        }

        if (node1 === node2) {
            return "Can't make an edge to the same node!"
        }

        if (cost.trim() === "") {
            return "Cost can't be empty!"
        }

        if (isNaN(Number(cost))) {
            return "Cost must be a number!"
        }

        const edgeExists = edges.find((edge) => edge.id === `${node1}-${node2}`)

        if (edgeExists) {
            const updatedEdge: Edge = { ...edgeExists, label: cost }
            const save = edges.map((edge) => edge.id === updatedEdge.id ? updatedEdge : edge)

            const error = await saveGraph(
                userEmail,
                currentGraph,
                undefined,
                save
            )

            if (error) return null

            setEdges(save)
            return null
        }

        const reverseExists = edges.some((edge) => edge.id === `${node2}-${node1}`)

        const newEdge: Edge = {
            id: `${node1}-${node2}`,
            source: `${getNodeId(node1)}`,
            target: `${getNodeId(node2)}`,
            label: `${field.Cost}`,
            type: "smoothstep",
            sourceHandle: reverseExists ? "bottom" : "top",
            targetHandle: reverseExists ? "bottom" : "top",
            zIndex: 0,
            style: {
                stroke: `#b1b1b7`
            },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: '#b1b1b7',
            },
        }

        const error = await saveGraph(userEmail, currentGraph, undefined, [...edges, newEdge])

        if (error) return error

        setEdges((prevEdges) => [...prevEdges, newEdge])
        return null
    }

    const addEdgeProp: ToolsDialogBoxProps = {
        title: "Add edge",
        description: "This can also be used to update existing edges!",
        btnName: "Add edge",
        icon: <Spline size={18} />,
        inputsToCreate: ["Node1", "Node2", "Cost"],
        action: addEdge
    }

    const removeEdge = async (field: ToolsDialogBoxField): Promise<string | null> => {
        const node1 = field.Node1.toLowerCase()
        const node2 = field.Node2.toLowerCase()

        if (!doesNodeExist(node1)) {
            return "First node given doesn't exist!"
        }

        if (!doesNodeExist(node2)) {
            return "Second node given doesn't exist!"
        }

        const targetEdge = edges.find((edge) => edge.id === `${node1}-${node2}`)

        if (targetEdge) {
            const save = edges.filter((edge) => edge.id !== `${node1}-${node2}`)
            const error = await saveGraph(
                userEmail,
                currentGraph,
                undefined,
                save
            )

            if (error) return error

            setEdges(save)
            return null
        } else {
            return "There is no edge between those nodes!"
        }
    }

    const removeEdgeProp: ToolsDialogBoxProps = {
        title: "Remove edge",
        description: "To delete multiple items quickly, hold Shift and drag a selection box around them, then press Backspace!",
        btnName: "Remove edge",
        icon: <SplinePointer size={18} />,
        inputsToCreate: ["Node1", "Node2"],
        action: removeEdge
    }

    const findPath = async (field: ToolsDialogBoxField): Promise<string | null> => {
        const node1 = field.Node1.toLowerCase()
        const node2 = field.Node2.toLowerCase()

        if (nodes.length <= 1) {
            return "Can't find a path when there's less than one node!"
        }

        if (!edges.length) {
            return "Can't find a path when there's no connections!"
        }

        if (!doesNodeExist(node1)) {
            return "First node given doesn't exist!"
        }

        if (!doesNodeExist(node2)) {
            return "Second node given doesn't exist!"
        }

        const useBellManFord = edges.some((edge) => Number(edge.label) < 0)

        let pathSet = new Set<string>()

        if (useBellManFord) {
            pathSet = bellmanford(nodes, edges, node1, node2)
        } else {
            pathSet = djikstra(nodes, edges, node1, node2)
        }

        if (pathSet.size) {
            const updatedEdges = edges.map((edge) => {
                const isPath = pathSet.has(edge.id)
                const color = isPath ? "#10B981" : "#b1b1b7"

                return {
                    ...edge,
                    zIndex: isPath ? 1 : 0,
                    style: {
                        ...edge.style,
                        stroke: color
                    },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        width: 20,
                        height: 20,
                        color: color
                    }
                }
            })

            setEdges(updatedEdges)
            return null
        } else {
            return "No path found between the nodes!"
        }

    }

    const findPathProp: ToolsDialogBoxProps = {
        title: "Find shortest path",
        description: "Uses Djikstra's algorithm if all costs are positive otherwise uses Bellman-Ford algorithm!",
        btnName: "Find path",
        icon: <ChartNetwork size={18} />,
        inputsToCreate: ["Node1", "Node2"],
        action: findPath
    }

    const minGraph = async (field: ToolsDialogBoxField): Promise<string | null> => {
        if (nodes.length <= 1) {
            return "Can't find a minimise the graph when there's less than one node!"
        }

        if (!edges.length) {
            return "Can't find a minimise the graph when there's no connections!"
        }

        const edgesSet = new Set(edges.map((edge) => `${edge.source}-${edge.target}`))
        const isGraphSymmetric = edges.every((edge) => edgesSet.has(`${edge.target}-${edge.source}`))

        if (isGraphSymmetric) {
            const mstEdges = kruskal(nodes, edges)
            const error = await saveGraph(
                userEmail,
                currentGraph,
                undefined,
                mstEdges
            )

            if (error) return error

            setEdges(mstEdges)
        } else {
            // Try implementing Chu-Liu/Edmonds in the future
        }

        return null
    }

    const minGraphProp: ToolsDialogBoxProps = {
        title: "Warning this action is permanent!",
        description: "Uses kruskal's algorithm to generate a MST if your graph is symmetric!",
        btnName: "Minimize Graph Cost",
        icon: <ChartNetwork size={18} />,
        inputsToCreate: [],
        action: minGraph
    }

    return (
        <>
            <ToolsDialogBox {...addNodeProp}></ToolsDialogBox>
            <ToolsDialogBox {...removeNodeProp}></ToolsDialogBox>
            <ToolsDialogBox {...addEdgeProp}></ToolsDialogBox>
            <ToolsDialogBox {...removeEdgeProp}></ToolsDialogBox>
            <ToolsDialogBox {...findPathProp}></ToolsDialogBox>
            <ToolsDialogBox {...minGraphProp}></ToolsDialogBox>
        </>
    )

}