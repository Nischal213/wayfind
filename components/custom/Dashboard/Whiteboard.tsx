"use client"

import { useCallback, } from 'react';
import {
    ReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    Background,
    type OnEdgesChange,
    type OnNodesChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { WhiteboardProps } from '@/lib/types';
import CustomNode from '@/components/common/CustomNode';
import { useClerk } from '@clerk/nextjs';
import { updateGraphDetails } from '@/actions/updateGraphDetails';


export const Whiteboard = (prop: WhiteboardProps) => {
    const { nodes, setNodes, edges, setEdges, currentGraph } = prop
    const nodeTypes = { custom: CustomNode }
    const { user } = useClerk()
    const userEmail = user?.primaryEmailAddress?.emailAddress

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [setNodes],
    )
    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [setEdges],
    )

    const onNodesDrapStop = async () => {
        const { success, error } = await updateGraphDetails(userEmail, currentGraph, nodes, undefined)

        if (!success) console.log(error)
    }

    return (
        <div className="w-full h-full text-black">
            <ReactFlow
                nodes={nodes}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onNodeDragStop={onNodesDrapStop}
                edges={edges}
                onEdgesChange={onEdgesChange}
                connectOnClick={false}
                deleteKeyCode={null}
                multiSelectionKeyCode={null}
                fitView
            >
                <Background />
            </ReactFlow>
        </div>
    )
}