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
import { LogOut, MessageCircle, Search } from "lucide-react"
import { RecentGraphs } from "./RecentGraphs"

const testProps = {
    graphs : Array<string>(20).fill("Hello world!")
} 

export const CustomSidebar = () => {
    const { user , signOut } = useClerk()

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

                    <SidebarMenu>
                        <SidebarMenuItem className="mb-4">
                            <SidebarMenuButton tooltip="New graph">
                                <MessageCircle size={18} />
                                <h1 className="ml-1">New graph</h1>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip="Find graphs">
                                <Search size={18} />
                                <h1 className="ml-1">Find graphs</h1>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel> Recent graphs </SidebarGroupLabel>
                        <RecentGraphs {...testProps}></RecentGraphs>
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
                                        { user?.fullName || user?.primaryEmailAddress?.emailAddress?.split("@")[0]}
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