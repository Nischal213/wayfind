"use client"

import { CustomSidebar } from "@/components/custom/Dashboard/CustomSidebar";
import { ToolSideBar } from "@/components/custom/Dashboard/ToolSidebar";
import { Whiteboard } from "@/components/custom/Dashboard/Whiteboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { type Edge, type Node } from "@xyflow/react";

export default function DashBoardPage() {
    const [nodes , setNodes] = useState<Node[]>([])
    const [edges , setEdges] = useState<Edge[]>([])

    return (
        <SidebarProvider>
            <div className="flex h-screen w-screen bg-white">
                <CustomSidebar />
                <Whiteboard nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges}/>
                <ToolSideBar nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges} />
            </div>
        </SidebarProvider>
    )
}