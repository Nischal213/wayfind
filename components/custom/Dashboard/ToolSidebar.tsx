import { Tools } from './Tools'
import { ChatWindow } from './ChatWindow'
import { ToolSideBarProps } from '@/lib/types'

export const ToolSideBar = (props: ToolSideBarProps) => {
    const { userTier, nodes, setNodes, edges, setEdges, currentGraph } = props

    return (
        <div className="flex flex-col bg-[#EDEDED] max-w-75 min-w-75">
            <Tools userTier={userTier} nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges} currentGraph={currentGraph}></Tools>
            <ChatWindow userTier={userTier} nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges} currentGraph={currentGraph}></ChatWindow>
        </div>
    )
}