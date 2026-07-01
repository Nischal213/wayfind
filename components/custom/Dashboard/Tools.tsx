import { MarkerType, type Node, type Edge, useReactFlow } from "@xyflow/react"
import { ToolsDialogBox } from "@/components/common/ToolsDialogBox"
import { ChartNetwork, CircleMinus, CirclePlus, Network, Spline, SplinePointer } from "lucide-react"
import { ToolsDialogBoxField, ToolsDialogBoxProps, ToolSideBarProps, WhiteboardProps } from "@/lib/types"
import { isNameValid, capitalizeWord, saveGraph, isReserved } from "@/lib/utils"
import { bellmanford } from "@/lib/algorithms/bellmanford"
import { djikstra } from "@/lib/algorithms/djikstra"
import { kruskal } from "@/lib/algorithms/kruskal"
import { chuLiuEdmond } from "@/lib/algorithms/chuLiuEdmond"
import { useUser } from "@clerk/nextjs"
import { featuresTable } from "@/lib/stripe/constants"
import { ToastProps } from "@/lib/types"

export const Tools = (props: ToolSideBarProps) => {
    const { userTier, nodes, setNodes, edges, setEdges, currentGraph } = props
    const { screenToFlowPosition } = useReactFlow()
    const { user } = useUser()
    const email = user?.primaryEmailAddress?.emailAddress

    if (!email) return

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

    const addNode = async (field: ToolsDialogBoxField): Promise<ToastProps> => {
        if (!field.Node1) {
            return { msg: "Node names can't be empty!", type: "warning" }
        }
        if (isReserved(field.Node1)) {
            return { msg: "This node name is reserved!", type: "warning" }
        }
        if (!isNameValid(field.Node1)) {
            return { msg: "Please use only letters, numbers, and single spaces!", type: "warning" }
        }
        if (doesNodeExist(field.Node1)) {
            return { msg: "Node names must be unique!", type: "warning" }
        }
        if (nodes.length === featuresTable[userTier].max_nodes_per_graph) {
            return { msg: "You've reached the maximum number of nodes for your plan!", type: "warning" }
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
        const error = await saveGraph(email, currentGraph, save, undefined)

        if (error) return { msg: error, type: "error" }

        setNodes(save)
        return { msg: "Node successfully added!", type: "success" }
    }

    const addNodeProp: ToolsDialogBoxProps = {
        title: "Add node",
        description: "Use the chatbox if you want to add multiple nodes quickly!",
        btnName: "Add node",
        icon: <CirclePlus size={18} />,
        inputsToCreate: ["Node1"],
        action: addNode
    }

    const removeNode = async (field: ToolsDialogBoxField): Promise<ToastProps> => {
        const node1 = field.Node1.toLowerCase()

        if (doesNodeExist(field.Node1)) {
            const save1 = nodes.filter((node) => node.id !== node1)
            const save2 = edges.filter((edge) => edge.target !== node1 && edge.source !== node1)
            const error = await saveGraph(
                email,
                currentGraph,
                save1,
                save2
            )

            if (error) return { msg: error, type: "error" }

            setNodes(save1)
            setEdges(save2)
            return { msg: "Node successfully removed!", type: "success" }
        } else {
            return { msg: "That node doesn't exist!", type: "warning" }
        }
    }

    const removeNodeProp: ToolsDialogBoxProps = {
        title: "Remove node",
        description: "To delete multiple nodes quickly, use the chatbot!",
        btnName: "Remove node",
        icon: <CircleMinus size={18} />,
        inputsToCreate: ["Node1"],
        action: removeNode
    }

    const addEdge = async (field: ToolsDialogBoxField): Promise<ToastProps> => {
        const node1 = field.Node1.toLowerCase()
        const node2 = field.Node2.toLowerCase()
        const cost = field.Cost

        if (nodes.length <= 1) {
            return { msg: "Can't make an edge when there's less than one node!", type: "warning" }
        }

        if (!doesNodeExist(node1)) {
            return { msg: "First node given doesn't exist!", type: "warning" }
        }

        if (!doesNodeExist(node2)) {
            return { msg: "Second node given doesn't exist!", type: "warning" }
        }

        if (node1 === node2) {
            return { msg: "Can't make an edge to the same node!", type: "warning" }
        }

        if (cost.trim() === "") {
            return { msg: "Cost can't be empty!", type: "warning" }
        }

        if (isNaN(Number(cost))) {
            return { msg: "Cost must be a number!", type: "warning" }
        }

        const edgeExists = edges.find((edge) => edge.id === `${node1}-${node2}`)

        if (edgeExists) {
            const updatedEdge: Edge = { ...edgeExists, label: cost }
            const save = edges.map((edge) => edge.id === updatedEdge.id ? updatedEdge : edge)

            const error = await saveGraph(
                email,
                currentGraph,
                undefined,
                save
            )

            if (error) return { msg: error, type: "error" }

            setEdges(save)
            return { msg: "Edge successfully updated!", type: "success" }
        }

        const reverseEdge = edges.find((edge) => edge.id === `${node2}-${node1}`)

        const newEdge: Edge = {
            id: `${node1}-${node2}`,
            source: `${getNodeId(node1)}`,
            target: `${getNodeId(node2)}`,
            label: `${field.Cost}`,
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
            },
        }

        const error = await saveGraph(email, currentGraph, undefined, [...edges, newEdge])

        if (error) return { msg: error, type: "error" }

        setEdges((prevEdges) => [...prevEdges, newEdge])
        return { msg: "Edge successfully added!", type: "success" }
    }

    const addEdgeProp: ToolsDialogBoxProps = {
        title: "Add edge",
        description: "This can also be used to update existing edges!",
        btnName: "Add edge",
        icon: <Spline size={18} />,
        inputsToCreate: ["Node1", "Node2", "Cost"],
        action: addEdge
    }

    const removeEdge = async (field: ToolsDialogBoxField): Promise<ToastProps> => {
        const node1 = field.Node1.toLowerCase()
        const node2 = field.Node2.toLowerCase()

        if (!doesNodeExist(node1)) {
            return { msg: "First node given doesn't exist!", type: "warning" }
        }

        if (!doesNodeExist(node2)) {
            return { msg: "Second node given doesn't exist!", type: "warning" }
        }

        const targetEdge = edges.find((edge) => edge.id === `${node1}-${node2}`)

        if (targetEdge) {
            const save = edges.filter((edge) => edge.id !== `${node1}-${node2}`)
            const error = await saveGraph(
                email,
                currentGraph,
                undefined,
                save
            )

            if (error) return { msg: error, type: "error" }

            setEdges(save)
            return { msg: "Edge successfully removed!", type: "success" }
        } else {
            return { msg: "There is no edge between those nodes!", type: "warning" }
        }
    }

    const removeEdgeProp: ToolsDialogBoxProps = {
        title: "Remove edge",
        description: "To delete multiple edges quickly use the chatbot!",
        btnName: "Remove edge",
        icon: <SplinePointer size={18} />,
        inputsToCreate: ["Node1", "Node2"],
        action: removeEdge
    }

    const findPath = async (field: ToolsDialogBoxField): Promise<ToastProps> => {
        const node1 = field.Node1.toLowerCase()
        const node2 = field.Node2.toLowerCase()

        if (nodes.length <= 1) {
            return { msg: "Can't find a path when there's less than one node!", type: "warning" }
        }

        if (!edges.length) {
            return { msg: "Can't find a path when there's no connections!", type: "warning" }
        }

        if (!doesNodeExist(node1)) {
            return { msg: "First node given doesn't exist!", type: "warning" }
        }

        if (!doesNodeExist(node2)) {
            return { msg: "Second node given doesn't exist!", type: "warning" }
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
            return { msg: "Path found!", type: "success" }
        } else {
            return { msg: "No path found between the nodes!", type: "warning" }
        }

    }

    const findPathProp: ToolsDialogBoxProps = {
        title: "Find shortest path",
        description: "Uses Djikstra's algorithm if all costs are positive otherwise uses Bellman-Ford algorithm!",
        btnName: "Find path",
        btnColor: "text-blue-800/95",
        icon: <ChartNetwork size={18} />,
        inputsToCreate: ["Node1", "Node2"],
        action: findPath
    }

    const minGraph = async (): Promise<ToastProps> => {
        if (nodes.length <= 1) {
            return { msg: "Can't find a minimise the graph when there's less than one node!", type: "warning" }
        }

        if (!edges.length) {
            return { msg: "Can't find a minimise the graph when there's no connections!", type: "warning" }
        }

        const edgeWeightTable: Record<string, number> = {}
        edges.forEach((edge) => {
            edgeWeightTable[`${edge.source}-${edge.target}`] = Number(edge.label)
        })

        // Since kruskal's algorithm only works on undirected graphs,
        // We check if every A -> B has a reverse B -> A with an equal
        // weight. Which is basically an undirected graph.
        const isGraphSymmetric = edges.every((edge) => {
            const reverseKey = `${edge.target}-${edge.source}`
            return reverseKey in edgeWeightTable &&
                edgeWeightTable[reverseKey] === Number(edge.label)
        })

        if (isGraphSymmetric) {
            const mstEdges = kruskal(nodes, edges)
            const save = mstEdges.reduce<Edge[]>((acc, edge) => {
                acc.push(edge)
                acc.push({
                    ...edge,
                    id: `${edge.target}-${edge.source}`,
                    source: edge.target,
                    target: edge.source,
                    sourceHandle: "bottom",
                    targetHandle: "bottom"
                })
                return acc
            }, [])

            const error = await saveGraph(
                email,
                currentGraph,
                undefined,
                save
            )

            if (error) return { msg: error, type: "error" }

            setEdges(save)
        } else {
            const finalEdges = chuLiuEdmond(nodes, edges)

            const error = await saveGraph(
                email,
                currentGraph,
                undefined,
                finalEdges
            )

            if (error) return { msg: error, type: "error" }

            setEdges(finalEdges)
        }

        return { msg: "Graph minimized!", type: "success" }
    }

    const minGraphProp: ToolsDialogBoxProps = {
        title: "Warning this action is permanent!",
        description: "Uses Kruskal's algorithm to generate a MST if your graph is symmetric, otherwise uses Chu-Liu-Edmonds!",
        btnName: "Minimize Graph Cost",
        btnColor: "text-blue-800/95",
        icon: <Network size={18} />,
        inputsToCreate: [],
        action: minGraph
    }

    return (
        <div className="flex flex-col gap-y-4">
            <div className="mt-5">
                <h2 className="text-neutral-500 ml-7 text-sm"> NODES </h2>
                <ToolsDialogBox {...addNodeProp}></ToolsDialogBox>
                <ToolsDialogBox {...removeNodeProp}></ToolsDialogBox>
                <div className="h-px mt-4 w-[90%] bg-neutral-800 mx-auto"></div>
            </div>

            <div>
                <h2 className="text-neutral-500 ml-7 text-sm"> EDGES </h2>
                <ToolsDialogBox {...addEdgeProp}></ToolsDialogBox>
                <ToolsDialogBox {...removeEdgeProp}></ToolsDialogBox>
                <div className="h-px mt-3 w-[90%] bg-neutral-800 mx-auto"></div>
            </div>

            <div>
                <h2 className="text-neutral-500 ml-7 text-sm"> ANALYSIS </h2>
                <ToolsDialogBox {...findPathProp}></ToolsDialogBox>
                <ToolsDialogBox {...minGraphProp}></ToolsDialogBox>
            </div>
        </div>
    )

}