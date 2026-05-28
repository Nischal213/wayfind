"use client"

import { useCallback, Dispatch, SetStateAction } from 'react';
import { 
    ReactFlow, 
    applyNodeChanges, 
    applyEdgeChanges, 
    Background, 
    type Node , 
    type Edge ,
    type OnEdgesChange,
    type OnNodesChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface WhiteboardProps {
    nodes : Node[]
    setNodes : Dispatch<SetStateAction<Node[]>>
    edges : Edge[]
    setEdges : Dispatch<SetStateAction<Edge[]>>
}
 
export const Whiteboard = (prop : WhiteboardProps) => {
    const { nodes , setNodes , edges , setEdges } = prop

    const onNodesChange : OnNodesChange = useCallback(
        (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [setNodes],
    )
    const onEdgesChange : OnEdgesChange = useCallback(
        (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [setEdges],
    )

    return (
        <div className="w-full h-full text-black">
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            connectOnClick={false}
            fitView
        >
            <Background/>
        </ReactFlow>
        </div>
    )
}