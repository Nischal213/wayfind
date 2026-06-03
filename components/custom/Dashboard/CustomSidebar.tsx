"use client"

import { useClerk } from "@clerk/nextjs"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarTrigger,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel
} from "@/components/ui/sidebar"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { LogOut } from "lucide-react"
import { RecentGraphs } from "./RecentGraphs"
import { CustomSidebarUtils } from "./CustomSidebarUtils"
import { Dispatch, SetStateAction, useState } from "react"
import { Edge, Node } from "@xyflow/react"

interface CustomSidebarProps {
    currentGraph: string
    setCurrentGraph: Dispatch<SetStateAction<string>>
    setNodes: Dispatch<SetStateAction<Node[]>>
    setEdges: Dispatch<SetStateAction<Edge[]>>
}

export const CustomSidebar = (prop: CustomSidebarProps) => {
    const { currentGraph, setCurrentGraph, setNodes, setEdges } = prop
    const { user, signOut } = useClerk()
    const [graphNames, setGraphNames] = useState<string[]>([])

    return (
        <TooltipProvider>
            <Sidebar collapsible="icon" className="bg-[#EDEDED]">
                <SidebarHeader>
                    <div className="flex items-center justify-between p-2 group-data-[state=collapsed]:justify-center">
                        <h1 className="text-3xl tracking-wider text-blue-600 font-semibold font-dancing-script group-data-[state=collapsed]:hidden">
                            Wayfind
                        </h1>
                        <SidebarTrigger size="lg" style={{ color: "black" }} />
                    </div>

                    <CustomSidebarUtils currentGraph={currentGraph} setCurrentGraph={setCurrentGraph} graphNames={graphNames} setGraphNames={setGraphNames}></CustomSidebarUtils>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel> Recent graphs </SidebarGroupLabel>
                        <RecentGraphs
                            graphNames={graphNames}
                            setGraphNames={setGraphNames}
                            setCurrentGraph={setCurrentGraph}
                            setNodes={setNodes}
                            setEdges={setEdges}
                        >
                        </RecentGraphs>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem className="flex items-center group-data-[state=expanded]:justify-between group-data-[state=collapsed]:justify-center p-2  rounded-lg">
                            <div className="flex items-center gap-3 group-data-[state=collapsed]:hidden">
                                <Avatar className="h-8 w-8 shrink-0">
                                    <AvatarImage src={user?.imageUrl} />
                                </Avatar>

                                <div className="text-sm leading-tight">
                                    <span className="w-32 block truncate font-semibold text-neutral-800">
                                        {user?.fullName || user?.primaryEmailAddress?.emailAddress?.split("@")[0]}
                                    </span>
                                </div>
                            </div>

                            <SidebarMenuButton
                                tooltip="Logout"
                                className="h-8 w-8 shrink-0 flex items-center justify-center group-data-[state=collapsed]:ml-0.5"
                                onClick={() => signOut({ redirectUrl: "/" })}
                            >
                                <LogOut size={18} />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </TooltipProvider>
    )
}