import { Edge, Node } from '@xyflow/react'
import { CircleDot } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

interface ToolSidebarProps {
    nodes : Node[]
    setNodes : Dispatch<SetStateAction<Node[]>>
    edges : Edge[]
    setEdges : Dispatch<SetStateAction<Edge[]>>
}

export const ToolSideBar = (props : ToolSidebarProps) => {
    const { nodes , setNodes , edges , setEdges} = props

    const addNode = () => {
        const nodeName = prompt("Enter node name: ")
        if (!nodeName) return

        const newNode : Node = {
            id : `${nodes.length + 1}`,
            data : { label: nodeName},
            position : { x : 0 , y : 200}
        }

        setNodes((nodesSnapshot) => [...nodesSnapshot , newNode])
    }

    const removeNode = () => {
        const nodeName = prompt("Enter node name: ")
        if (!nodeName) return

        const targetNode = nodes?.find((node) => node.data?.label === nodeName)

        if (targetNode) {
            setNodes((nodesSnapshot) => nodesSnapshot.filter((node) => node.data?.label !== nodeName))
        } else {
            alert("No node like that exists!")
        }
    }

    const addEdge = () => {
        const node1 = prompt("Enter the first node: ")

        if (!node1) return

        const node2 = prompt("Enter the second node: ")

        if (!node2) return 

        let distance = prompt(`Enter the distance between ${node1} and ${node2}: `)

        while (distance !== "" && isNaN(Number(distance))) {
            alert("That isn't a number please try again!")
            distance = prompt(`Enter the distance between ${node1} and ${node2}: `)
        }

        const newEdge : Edge = {
            id : `${node1}-${node2}`,
            source : `${nodes.find((node) => node.data.label === node1)?.id}`,
            target : `${nodes.find((node) => node.data.label === node2)?.id}`,
            label : `${distance}`, 
        }
        
        setEdges((edgesSnapshot) => [...edgesSnapshot , newEdge])
    }

    const removeEdge = () => {
        const node1 = prompt("Enter the first node: ")

        if (!node1) return

        const node2 = prompt("Enter the second node: ")

        if (!node2) return 

        const targetEdge = edges?.find((edge) => edge.id === `${node1}-${node2}`)

        if (targetEdge) {
            setEdges((edgesSnapshot) => edgesSnapshot.filter((edge) => edge.id !== `${node1}-${node2}`))
        } else {
            alert("That edge doesn't exist!")
        }

    }
    
    return (
        <div className="flex flex-col bg-[#EDEDED] w-1/4">
            <h1 className="text-red-400 text-center mt-5 text-2xl">Tool bar</h1>
            <button
            onClick={addNode}
            className="flex items-center gap-2 mx-4 mt-4 px-3 py-2 rounded-lg hover:bg-neutral-300 text-sm text-neutral-700"
            >
                <CircleDot size={18} />
                Add node
            </button>
            <button
            onClick={removeNode}
            className="flex items-center gap-2 mx-4 mt-4 px-3 py-2 rounded-lg hover:bg-neutral-300 text-sm text-neutral-700"
            >
                <CircleDot size={18} />
                Remove node
            </button>
            <button
            onClick={addEdge}
            className="flex items-center gap-2 mx-4 mt-4 px-3 py-2 rounded-lg hover:bg-neutral-300 text-sm text-neutral-700"
            >
                <CircleDot size={18} />
                Add edge
            </button>
            <button
            onClick={removeEdge}
            className="flex items-center gap-2 mx-4 mt-4 px-3 py-2 rounded-lg hover:bg-neutral-300 text-sm text-neutral-700"
            >
                <CircleDot size={18} />
                Remove edge
            </button>
        </div>
    )
}