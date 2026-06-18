import { createGraph } from "@/actions/createGraph"
import { deleteGraph } from "@/actions/deleteGraph"
import { UtilsDialogBox } from "@/components/common/UtilsDialogBox"
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { UtilsDialogBoxProps } from "@/lib/types"
import { useUser } from "@clerk/nextjs"
import { MessageCircle, CircleMinus } from "lucide-react"
import { Dispatch, SetStateAction } from "react"

interface CustomSidebarUtilsProps {
    graphNames: string[]
    setGraphNames: Dispatch<SetStateAction<string[]>>
    currentGraph: string
    setCurrentGraph: Dispatch<SetStateAction<string>>
}

export const CustomSidebarUtils = (props: CustomSidebarUtilsProps) => {
    const { graphNames, setGraphNames, currentGraph, setCurrentGraph } = props
    const { user } = useUser()
    const email = user?.primaryEmailAddress?.emailAddress!

    const makeNewGraph = async (userInput: string): Promise<string | null> => {
        if (!userInput.length) return "Graph names can't be empty!"
        if (graphNames.find((name) => name === userInput)) return "This graph already exists!"

        const { success, error } = await createGraph(email, userInput)

        if (success) {
            setGraphNames((prevGraphNames) => [userInput, ...prevGraphNames])
            return null
        } else {
            return error
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

    const removeGraph = async (userInput: string): Promise<string | null> => {
        if (!userInput.length) return "Graph names can't be empty!"
        if (!graphNames.find((name) => name === userInput)) return "This graph doesn't exist!"

        const { success, error } = await deleteGraph(email, userInput)

        if (!success) return error

        if (userInput === currentGraph) {
            setCurrentGraph("")
        }

        setGraphNames(graphNames.filter((graphName) => graphName !== userInput))
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