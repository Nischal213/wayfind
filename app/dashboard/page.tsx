"use client"

import { CustomSidebar } from "@/components/custom/Dashboard/CustomSidebar";
import { ToolSideBar } from "@/components/custom/Dashboard/ToolSidebar";
import { Whiteboard } from "@/components/custom/Dashboard/Whiteboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { type Edge, type Node } from "@xyflow/react";
import { createUser } from "@/actions/createUser";
import { useAuth, useClerk } from "@clerk/nextjs";

export default function DashBoardPage() {
    const [nodes, setNodes] = useState<Node[]>([])
    const [edges, setEdges] = useState<Edge[]>([])
    const { isLoaded, isSignedIn } = useAuth()
    const { user } = useClerk()

    useEffect(() => {
        const userEmail = user?.primaryEmailAddress?.emailAddress

        if (!isLoaded || !isSignedIn || !userEmail) return

        const logUserEvent = async () => {
            const { success, error } = await createUser(userEmail)

            if (!success) {
                throw new Error(`${error}`)
            }
        }

        logUserEvent()
    }, [isLoaded, isSignedIn, user?.primaryEmailAddress?.emailAddress])

    return (
        <SidebarProvider>
            <div className="flex h-screen w-screen bg-white">
                <CustomSidebar />
                <Whiteboard nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges} />
                <ToolSideBar nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges} />
            </div>
        </SidebarProvider>
    )
}