import { createGraph } from "@/actions/createGraph"
import { UtilsDialogBox } from "@/components/common/UtilsDialogBox"
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { UtilsDialogBoxProps } from "@/lib/types"
import { useClerk } from "@clerk/nextjs"
import { MessageCircle, CircleMinus } from "lucide-react"

export const CustomSidebarUtils = () => {
    const { user } = useClerk()
    const userEmail = user?.primaryEmailAddress?.emailAddress

    const makeNewGraph = async (userInput: string): Promise<string | null> => {
        if (!userEmail) return "Clerk hasn't loaded in yet please wait!"
        if (!userInput.length) return "Graph names can't be empty!"

        const { success, error } = await createGraph(userEmail, userInput)

        return !success ? error : null
    }

    const makeNewGraphProp: UtilsDialogBoxProps = {
        title: "New graph",
        description: "Use this to make a new graph",
        btnName: "New graph",
        icon: <MessageCircle size={18} className="" />,
        inputName: "Graph name",
        action: makeNewGraph
    }

    const removeGraph = async (userInput: string): Promise<string | null> => {
        return null
    }

    const removeGraphProp: UtilsDialogBoxProps = {
        title: "Remove graph",
        description: "Use this to remove a graph",
        btnName: "Remove graph",
        icon: <CircleMinus size={18} />,
        inputName: "Graph name",
        action: removeGraph
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem className="mb-4">
                <UtilsDialogBox {...makeNewGraphProp}></UtilsDialogBox>
            </SidebarMenuItem>

            <SidebarMenuItem>
                <UtilsDialogBox {...removeGraphProp}></UtilsDialogBox>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}