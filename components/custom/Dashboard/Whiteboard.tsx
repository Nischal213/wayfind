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

 
export const Whiteboard = (prop : WhiteboardProps) => {
    const { nodes , setNodes , edges , setEdges } = prop
    const nodeTypes = { custom: CustomNode }

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
            nodeTypes={nodeTypes}
            fitView
        >
            <Background/>
        </ReactFlow>
        </div>
    )
}