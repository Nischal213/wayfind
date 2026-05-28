import { MarkerType, type Node, type Edge } from "@xyflow/react"
import { Dispatch, SetStateAction } from "react"
import { DialogBox, DialogBoxField , DialogBoxProps } from "@/components/common/DialogBox"
import { CircleMinus, CirclePlus, Spline, SplinePointer } from "lucide-react"

interface ToolsProp {
    nodes : Node[]
    setNodes : Dispatch<SetStateAction<Node[]>>
    edges : Edge[]
    setEdges : Dispatch<SetStateAction<Edge[]>>
}


export const Tools = (props : ToolsProp) => {
    const { nodes , setNodes , edges , setEdges} = props

    const isAlphanumerical = (str : string) => {
        return /^[a-zA-Z0-9]+$/.test(str)
    }

    const doesNodeExist = (fieldNode : string) => {
        if (nodes.length == 0) {
            return false
        }

        const findNode = nodes.find((node) => node.data.label === fieldNode)

        return findNode ? true : false
    }

    const getNodeId = (fieldNode : string) => {
        if (nodes && nodes.length > 0) {
            const targetNode =  nodes.find((node) => node.data.label === fieldNode)

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

        const isNameDuplicate = nodes.find((node) => {
            if (node.data.label && typeof node.data.label === "string") {
                return node.data.label.toLowerCase() === field.Node1.toLowerCase()
            } 
        })

        if (isNameDuplicate) {
            return "Node names must be unique!"
        }

        const newNode : Node = {
            id : `${field.Node1}`,
            data : { label: field.Node1},
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
        btnName : "Add node",
        icon : <CirclePlus size={18} />,
        inputsToCreate : ["Node1"],
        action : addNode
    }

    const removeNode = (field : DialogBoxField) : string | null => {
        if (doesNodeExist(field.Node1)) {
            setNodes((prevNodes) => prevNodes.filter((nodes) => nodes.data.label !== field.Node1))
            return null
        } else {
            return "That node doesn't exist!"
        }
    }

    const removeNodeProp : DialogBoxProps = {
        title : "Remove node",
        description : true,
        btnName : "Remove node",
        icon : <CircleMinus size={18} />,
        inputsToCreate : ["Node1"],
        action : removeNode
    }

    const addEdge = (field : DialogBoxField) : string | null => {
        if (!doesNodeExist(field.Node1)) {
            return "First node given doesn't exist!"
        }

        if (!doesNodeExist(field.Node2)) {
            return "Second node given doesn't exist!"
        }

        if (field.Node1 === field.Node2) {
            return "Can't make an edge to the same node!"
        }

        if (field.Distance.trim() === "") {
            return "Distance can't be empty!"
        }

        if (isNaN(Number(field.Distance))) {
            return "Distance must be a number!"
        }

        const newEdge : Edge = {
            id : `${field.Node1}-${field.Node2}`,
            source : `${getNodeId(field.Node1)}`,
            target : `${getNodeId(field.Node2)}`,
            label : `${field.Distance}`,
            type : "smoothstep",
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
        btnName : "Add edge",
        icon : <Spline size={18}/>,
        inputsToCreate : ["Node1" , "Node2" , "Distance"],
        action : addEdge
    }

    const removeEdge = (field : DialogBoxField) : string | null => {
        if (!doesNodeExist(field.Node1)) {
            return "First node given doesn't exist!"
        }

        if (!doesNodeExist(field.Node2)) {
            return "Second node given doesn't exist!"
        }

        const targetEdge = edges.find((edge) => edge.id === `${field.Node1}-${field.Node2}`)

        if (targetEdge) {
            setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== `${field.Node1}-${field.Node2}`))
            return null
        } else {
            return "There is no edge between those nodes!" 
        }
    }

    const removeEdgeProp : DialogBoxProps = {
        title : "Remove edge",
        description : true,
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