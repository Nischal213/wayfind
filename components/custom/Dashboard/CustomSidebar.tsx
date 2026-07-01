"use client"

import { useClerk, useSignIn } from "@clerk/nextjs"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ChevronUp, LogOut } from "lucide-react"
import { RecentGraphs } from "./RecentGraphs"
import { CustomSidebarUtils } from "./CustomSidebarUtils"
import { Dispatch, SetStateAction, useState } from "react"
import { Edge, Node } from "@xyflow/react"
import { StripeResponse, Tiers } from "@/lib/stripe/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { GrUpgrade } from "react-icons/gr"
import { TbCancel } from "react-icons/tb"
import { useRouter } from "next/navigation"
import { showToast } from "@/lib/utils"

interface CustomSidebarProps {
    userTier: Tiers
    currentGraph: string
    setCurrentGraph: Dispatch<SetStateAction<string>>
    setNodes: Dispatch<SetStateAction<Node[]>>
    setEdges: Dispatch<SetStateAction<Edge[]>>
}

export const CustomSidebar = (prop: CustomSidebarProps) => {
    const { userTier, currentGraph, setCurrentGraph, setNodes, setEdges } = prop
    const { signIn } = useSignIn()
    const { user, signOut } = useClerk()
    const [graphNames, setGraphNames] = useState<string[]>([])
    const router = useRouter()

    const cancelPayment = async () => {
        const response = await fetch("/api/stripe/portal", {
            method: "POST"
        })

        const data: StripeResponse = await response.json()

        if (!data.error) {
            router.push(data.url)
        } else {
            showToast(data.error, "error")
        }
    }

    return (
        <TooltipProvider>
            <Sidebar collapsible="icon" className="bg-[#EDEDED]">
                <SidebarHeader>
                    <div className="flex items-center justify-between p-2 group-data-[state=collapsed]:justify-center">
                        <h1 className="text-3xl tracking-wider text-blue-600 font-semibold font-dancing-script group-data-[state=collapsed]:hidden">
                            Wayfind
                        </h1>
                        <SidebarTrigger size="lg" className="cursor-pointer" style={{ color: "black" }} />
                    </div>

                    <CustomSidebarUtils userTier={userTier} currentGraph={currentGraph} setCurrentGraph={setCurrentGraph} graphNames={graphNames} setGraphNames={setGraphNames}></CustomSidebarUtils>
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

                <SidebarFooter className="border-t-2 border-neutral-400/50 p-0 group-data-[state=collapsed]:border-0">
                    <SidebarMenu className="p-0">
                        <SidebarMenuItem className="p-0">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip="Account"
                                        className=" cursor-pointer
                                            w-full h-auto flex items-center gap-x-3 rounded-none px-4 py-3
                                            group-data-[state=collapsed]:absolute group-data-[state=collapsed]:bottom-3
                                            group-data-[state=collapsed]:left-2 group-data-[state=collapsed]:rounded-full"
                                    >
                                        <Avatar className="
                                            h-8 w-8 shrink-0
                                            group-data-[state=collapsed]:absolute group-data-[state=collapsed]:bottom-0
                                            group-data-[state=collapsed]:left-0"
                                        >
                                            <AvatarImage src={user?.imageUrl} />
                                            <AvatarFallback className="text-xs font-semibold bg-neutral-300 text-neutral-700">
                                                ?
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex flex-col overflow-hidden group-data-[state=collapsed]:hidden">
                                            <span className="text-[13px] leading-tight truncate font-semibold text-neutral-800">
                                                {user?.fullName || user?.primaryEmailAddress?.emailAddress?.split("@")[0]}
                                            </span>
                                            <span className="text-[11px] leading-normal font-medium text-neutral-500">
                                                {userTier ? userTier.charAt(0).toUpperCase() + userTier.slice(1) + " plan" : "Loading..."}
                                            </span>
                                        </div>

                                        <ChevronUp className="ml-auto shrink-0 text-neutral-500 group-data-[state=collapsed]:hidden" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent
                                    side="right"
                                    align="end"
                                    className="w-56 mb-2"
                                    onCloseAutoFocus={(e) => e.preventDefault()}
                                >
                                    <DropdownMenuLabel className="font-normal">
                                        <span className="text-xs text-neutral-500 truncate">
                                            {user?.primaryEmailAddress?.emailAddress}
                                        </span>
                                    </DropdownMenuLabel>

                                    <DropdownMenuItem
                                        className="text-blue-600 focus:bg-neutral-100 cursor-pointer"
                                        onClick={() => {
                                            router.push("/pricing")
                                        }}
                                    >
                                        <GrUpgrade className="mr-0.5 h-4 w-4" />
                                        Upgrade Plan
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        className="text-red-600 focus:bg-neutral-100 cursor-pointer"
                                        onClick={cancelPayment}
                                    >
                                        <TbCancel className="mr-0.5 h-4 w-4" />
                                        Cancel Plan
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        className="text-neutral-600-600 focus:bg-neutral-100 cursor-pointer"
                                        onClick={() => {
                                            signIn.reset()
                                            signOut({ redirectUrl: "/" })
                                        }}
                                    >
                                        <LogOut className="mr-0.5 h-4 w-4" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </TooltipProvider>
    )
}