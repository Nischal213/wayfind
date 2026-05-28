import { Edge, Node } from '@xyflow/react'
import { Dispatch, SetStateAction } from 'react'
import { Tools } from './Tools'

interface ToolSidebarProps {
    nodes : Node[]
    setNodes : Dispatch<SetStateAction<Node[]>>
    edges : Edge[]
    setEdges : Dispatch<SetStateAction<Edge[]>>
}

export const ToolSideBar = (props : ToolSidebarProps) => {
    const { nodes , setNodes , edges , setEdges} = props
    
    return (
        <div className="flex flex-col bg-[#EDEDED] w-1/4">
            <h1 className="text-red-400 text-center mt-5 text-2xl">Tool bar</h1>
            <Tools nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges}></Tools>
        </div>
    )
}