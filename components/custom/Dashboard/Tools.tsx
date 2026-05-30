import { MarkerType, type Node, type Edge } from "@xyflow/react"
import { DialogBox } from "@/components/common/DialogBox"
import { CircleMinus, CirclePlus, Spline, SplinePointer } from "lucide-react"
import { DialogBoxField, DialogBoxProps, WhiteboardProps } from "@/lib/types"
import { isAlphanumerical , capitalizeWord } from "@/lib/utils"


export const Tools = (props : WhiteboardProps) => {
    const { nodes , setNodes , edges , setEdges} = props

    const doesNodeExist = (fieldNode : string) => {
        if (nodes.length == 0) {
            return false
        }

        const findNode = nodes.some((node) => {
            return node.id === fieldNode.toLowerCase()
        })

        return findNode
    }

    const getNodeId = (fieldNode : string) => {
        if (nodes && nodes.length > 0) {
            const targetNode = nodes.find((node) => node.data.label === fieldNode)

            if (targetNode) {
                return targetNode.id
            }
        }

        throw new Error("Something went wrong. Go debug it.")
    }

    const addNode = (field : DialogBoxField) : string | null => {
        if (!field.Node1) {
            return "Node names can't be empty!"
        }

        if (!isAlphanumerical(field.Node1)) {
            return "Node names must consist of letters or numbers only!"
        }

        if (doesNodeExist(field.Node1)) {
            return "Node names must be unique!"
        }

        const newNode : Node = {
            id : `${field.Node1.toLowerCase()}`,
            type : "custom",
            data : { label: capitalizeWord(field.Node1)},
            position: {
                x: Math.random() * 400 - 200, 
                y: Math.random() * 300 + 50
            }
        }

        setNodes((prevNodes) => [...prevNodes , newNode])

        return null
    }

    const addNodeProp : DialogBoxProps = {
        title : "Add node",
        description : "Use the chatbox if you want to add multiple nodes quickly!",
        btnName : "Add node",
        icon : <CirclePlus size={18} />,
        inputsToCreate : ["Node1"],
        action : addNode
    }

    const removeNode = (field : DialogBoxField) : string | null => {
        if (doesNodeExist(field.Node1)) {
            setNodes((prevNodes) => prevNodes.filter((nodes) => nodes.data.label !== capitalizeWord(field.Node1)))
            return null
        } else {
            return "That node doesn't exist!"
        }
    }

    const removeNodeProp : DialogBoxProps = {
        title : "Remove node",
        description : "To delete multiple items quickly, hold Shift and drag a selection box around them, then press Backspace!",
        btnName : "Remove node",
        icon : <CircleMinus size={18} />,
        inputsToCreate : ["Node1"],
        action : removeNode
    }

    const addEdge = (field : DialogBoxField) : string | null => {
        const node1 = capitalizeWord(field.Node1)
        const node2 = capitalizeWord(field.Node2)
        const distance = field.Distance


        if (!doesNodeExist(node1)) {
            return "First node given doesn't exist!"
        }

        if (!doesNodeExist(node2)) {
            return "Second node given doesn't exist!"
        }

        if (node1 === node2) {
            return "Can't make an edge to the same node!"
        }

        if (distance.trim() === "") {
            return "Distance can't be empty!"
        }

        if (isNaN(Number(distance))) {
            return "Distance must be a number!"
        }

        const edgeExists = edges.find((edge) => edge.id === `${node1}-${node2}`)
        
        if (edgeExists) {
            const updatedEdge : Edge = {...edgeExists , label : distance}

            setEdges((prevEdges) => 
                prevEdges.map((edge) => edge.id === updatedEdge.id ? updatedEdge : edge)
            )
            return null
        }

        const reverseExists = edges.some((edge) => edge.id === `${node2}-${node1}`)

        const newEdge: Edge = {
            id: `${node1}-${node2}`,
            source: `${getNodeId(node1)}`,
            target: `${getNodeId(node2)}`,
            label: `${field.Distance}`,
            type: "smoothstep",
            sourceHandle: reverseExists ? "bottom" : "top",
            targetHandle: reverseExists ? "bottom" : "top",
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
                color: '#b1b1b7',
            },
        }

        setEdges((prevEdges) => [...prevEdges , newEdge])

        return null
    }

    const addEdgeProp : DialogBoxProps = {
        title : "Add edge",
        description : "This can also be used to update existing edges!",
        btnName : "Add edge",
        icon : <Spline size={18}/>,
        inputsToCreate : ["Node1" , "Node2" , "Distance"],
        action : addEdge
    }

    const removeEdge = (field : DialogBoxField) : string | null => {
        const node1 = capitalizeWord(field.Node1)
        const node2 = capitalizeWord(field.Node2)

        if (!doesNodeExist(node1)) {
            return "First node given doesn't exist!"
        }

        if (!doesNodeExist(node2)) {
            return "Second node given doesn't exist!"
        }

        const targetEdge = edges.find((edge) => edge.id === `${node1}-${node2}`)

        if (targetEdge) {
            setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== `${node1}-${node2}`))
            return null
        } else {
            return "There is no edge between those nodes!" 
        }
    }

    const removeEdgeProp : DialogBoxProps = {
        title : "Remove edge",
        description : "To delete multiple items quickly, hold Shift and drag a selection box around them, then press Backspace!",
        btnName : "Remove edge",
        icon : <SplinePointer size={18} />,
        inputsToCreate : ["Node1" , "Node2"],
        action : removeEdge
    }

    return (
        <>
            <DialogBox {...addNodeProp}></DialogBox>
            <DialogBox {...removeNodeProp}></DialogBox>
            <DialogBox {...addEdgeProp}></DialogBox>
            <DialogBox {...removeEdgeProp}></DialogBox>
        </>
    )

}