import { SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar"

interface RecentGraphsProp {
    graphs: string[]
}

export const RecentGraphs = (props : RecentGraphsProp) => {

    const { graphs } = props

    return (
        <SidebarMenu>
            {graphs.map((i,key) => 
                <SidebarMenuButton className="group-data-[state=collapsed]:hidden" key={key}>
                    {i}
                </SidebarMenuButton>
            )}                
        </SidebarMenu>
    )
}