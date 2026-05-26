"use client"

import { useState, useCallback, Dispatch, SetStateAction } from 'react';
import { 
    ReactFlow, 
    applyNodeChanges, 
    applyEdgeChanges, 
    addEdge, 
    Background, 
    type Node , 
    type Edge ,
    type OnEdgesChange,
    type OnNodesChange,
    type OnConnect
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface WhiteboardProps {
    nodes : Node[]
    setNodes : Dispatch<SetStateAction<Node[]>>
    edges : Edge[]
    setEdges : Dispatch<SetStateAction<Edge[]>>
}
 
const initialNodes : Node[] = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
  { id: "n3",position: { x: 0 , y : 200 } , data: { label: "Node 3"}},
]

const initialEdges : Edge[] = [
    { id: 'n1-n2', source: 'n1', target: 'n2', type : "default" , label: "connects with" }
]
 
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
    const onConnect : OnConnect = useCallback(
        (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [setEdges],
    )

    return (
        <div className="w-full h-full text-black">
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
        >
            <Background/>
        </ReactFlow>
        </div>
    )
}