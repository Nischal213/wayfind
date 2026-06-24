import { Tools } from './Tools'
import { WhiteboardProps } from '@/lib/types'
import { ChatWindow } from './ChatWindow'

export const ToolSideBar = (props: WhiteboardProps) => {
    const { nodes, setNodes, edges, setEdges, currentGraph } = props

    return (
        <div className="flex flex-col bg-[#EDEDED] max-w-75 min-w-75">
            <Tools nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges} currentGraph={currentGraph}></Tools>
            <ChatWindow nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges} currentGraph={currentGraph}></ChatWindow>
        </div>
    )
}