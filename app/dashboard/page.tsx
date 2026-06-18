"use client"

import { CustomSidebar } from "@/components/custom/Dashboard/CustomSidebar";
import { ToolSideBar } from "@/components/custom/Dashboard/ToolSidebar";
import { Whiteboard } from "@/components/custom/Dashboard/Whiteboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { ReactFlowProvider, type Edge, type Node } from "@xyflow/react";
import { createUser } from "@/actions/createUser";
import { useUser } from "@clerk/nextjs";
import { ChartNoAxesColumnIncreasing } from "lucide-react";

export default function DashBoardPage() {
    const [nodes, setNodes] = useState<Node[]>([])
    const [edges, setEdges] = useState<Edge[]>([])
    const [currentGraph, setCurrentGraph] = useState<string>("")
    const { isLoaded, isSignedIn, user } = useUser()
    const email = user?.primaryEmailAddress?.emailAddress

    useEffect(() => {
        if (!isLoaded || !isSignedIn || !email) return

        const makeNewUser = async () => {
            const { success, error } = await createUser(email)

            if (!success) {
                throw new Error(`${error}`)
            }
        }

        makeNewUser()
    }, [isLoaded, isSignedIn, email])

    return (
        <ReactFlowProvider>
            <SidebarProvider>
                <div className="flex h-screen w-screen bg-white">
                    <CustomSidebar currentGraph={currentGraph} setCurrentGraph={setCurrentGraph} setNodes={setNodes} setEdges={setEdges} />
                    {currentGraph ?
                        <>
                            <Whiteboard nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges} currentGraph={currentGraph} />
                            <ToolSideBar nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges} currentGraph={currentGraph} />
                        </>
                        :
                        <div className="flex flex-col items-center justify-center w-full min-h-[52vh] px-6 text-center select-none">
                            <div className="flex flex-col items-center max-w-105">

                                <div className="flex animate-fade-in-up [--delay:0.1s] items-center justify-center w-12 h-12 rounded-lg border border-stone-200 mb-6">
                                    <ChartNoAxesColumnIncreasing className="w-5 h-5 text-black" />
                                </div>

                                <h2 className="animate-fade-in-up [--delay:0.35s] text-lg font-medium text-stone-800 mb-2 leading-snug">
                                    Welcome to your workspace
                                </h2>

                                <p className="animate-fade-in-up [--delay:0.55s] text-sm text-stone-500 leading-relaxed">
                                    Your whiteboard is ready. Load a saved graph to pick up where you left off,
                                    or create a new graph to start visualising your data.
                                </p>

                            </div>
                        </div>
                    }
                </div>
            </SidebarProvider>
        </ReactFlowProvider>
    )
}