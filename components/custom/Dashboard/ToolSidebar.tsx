import { Tools } from './Tools'
import { WhiteboardProps } from '@/lib/types'
import { ChatWindow } from './ChatWindow'


export const ToolSideBar = (props : WhiteboardProps) => {
    const { nodes , setNodes , edges , setEdges} = props
    
    return (
        <div className="flex flex-col bg-[#EDEDED] w-1/4 min-w-62.5">
            <h1 className="text-neutral-700 font-medium text-center mt-5 mb-3 text-2xl">Tool bar</h1>
            <Tools nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges}></Tools>
            <ChatWindow nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges}></ChatWindow>
        </div>
    )
}