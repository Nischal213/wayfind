import { CustomSidebar } from "@/components/custom/Dashboard/CustomSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashBoardPage() {

    return (
        <div className="min-h-full min-w-full bg-white">
            <SidebarProvider>
                <CustomSidebar></CustomSidebar>
            </SidebarProvider>
        </div>
    )
}