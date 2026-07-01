import { createGraph } from "@/actions/createGraph"
import { deleteGraph } from "@/actions/deleteGraph"
import { UtilsDialogBox } from "@/components/common/UtilsDialogBox"
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { Tiers } from "@/lib/stripe/types"
import { featuresTable } from "@/lib/stripe/constants"
import { UtilsDialogBoxProps, ToastProps } from "@/lib/types"
import { useUser } from "@clerk/nextjs"
import { MessageCircle, CircleMinus } from "lucide-react"
import { Dispatch, SetStateAction } from "react"

interface CustomSidebarUtilsProps {
    userTier: Tiers
    graphNames: string[]
    setGraphNames: Dispatch<SetStateAction<string[]>>
    currentGraph: string
    setCurrentGraph: Dispatch<SetStateAction<string>>
}

export const CustomSidebarUtils = (props: CustomSidebarUtilsProps) => {
    const { userTier, graphNames, setGraphNames, currentGraph, setCurrentGraph } = props
    const { user } = useUser()
    const email = user?.primaryEmailAddress?.emailAddress

    const makeNewGraph = async (userInput: string): Promise<ToastProps> => {
        if (!email) {
            return { msg: "Please wait for clerk to finish loading!", type: "warning" }
        }
        if (!userInput.length) {
            return { msg: "Graph names can't be empty!", type: "warning" }
        }
        if (graphNames.find((name) => name === userInput)) {
            return { msg: "This graph already exists!", type: "warning" }
        }
        if (graphNames.length === featuresTable[userTier].max_saved_graphs) {
            return { msg: "You have reached the maximum number of graphs for your plan!", type: "warning" }
        }

        const { success, error } = await createGraph(email, userInput)

        if (success) {
            setGraphNames((prevGraphNames) => [userInput, ...prevGraphNames])
            return { msg: "Graph created!", type: "success" }
        } else {
            return { msg: error, type: "error" }
        }
    }

    const makeNewGraphProp: UtilsDialogBoxProps = {
        title: "New graph",
        description: "Use this to make a new graph",
        btnName: "New graph",
        icon: <MessageCircle size={18} className="" />,
        inputName: "Graph name",
        action: makeNewGraph
    }

    const removeGraph = async (userInput: string): Promise<ToastProps> => {
        if (!email) {
            return { msg: "Please wait for clerk to finish loading!", type: "warning" }
        }
        if (!userInput.length) {
            return { msg: "Graph names can't be empty!", type: "warning" }
        }
        if (!graphNames.find((name) => name === userInput)) {
            return { msg: "This graph doesn't exist!", type: "warning" }
        }

        const { success, error } = await deleteGraph(email, userInput)

        if (!success) return { msg: error, type: "error" }

        if (userInput === currentGraph) {
            setCurrentGraph("")
        }

        setGraphNames(graphNames.filter((graphName) => graphName !== userInput))
        return { msg: "Graph removed!", type: "success" }
    }

    const removeGraphProp: UtilsDialogBoxProps = {
        title: "Remove graph",
        description: "Use this to remove a graph",
        btnName: "Remove graph",
        btnColor: "text-red-600",
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