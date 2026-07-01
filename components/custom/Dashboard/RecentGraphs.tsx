import { getGraphDetails } from "@/actions/getGraphDetails"
import { getUserRecentGraphs } from "@/actions/getUserRecentGraphs"
import { SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar"
import { Spinner } from "@/components/ui/spinner"
import { showToast } from "@/lib/utils"
import { useUser } from "@clerk/nextjs"
import { Edge, Node } from "@xyflow/react"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

interface RecentGraphsProps {
    graphNames: string[]
    setGraphNames: Dispatch<SetStateAction<string[]>>
    setCurrentGraph: Dispatch<SetStateAction<string>>
    setNodes: Dispatch<SetStateAction<Node[]>>
    setEdges: Dispatch<SetStateAction<Edge[]>>
}

export const RecentGraphs = (prop: RecentGraphsProps) => {
    const { graphNames, setGraphNames, setCurrentGraph, setNodes, setEdges } = prop
    const [showSpinner, setSpinner] = useState(true)
    const { isLoaded, isSignedIn, user } = useUser()
    const email = user?.primaryEmailAddress?.emailAddress

    useEffect(() => {
        if (!isLoaded || !isSignedIn || !email) return

        const getRecentGraphs = async () => {
            const { success, error, result } = await getUserRecentGraphs(email)
            setSpinner(false)

            if (!success) {
                showToast(error, "error")
            } else {
                setGraphNames(result.graphs.map((graph) => graph.name))
            }

            return
        }

        getRecentGraphs()

    }, [isLoaded, isSignedIn, setGraphNames, email])

    const loadGraph = async (graphName: string) => {
        const { success, error, result } = await getGraphDetails(email!, graphName)

        if (!success) return showToast(error, "error")

        setCurrentGraph(graphName)
        setNodes(result.nodes)
        setEdges(result.edges)
    }

    return (
        <SidebarMenu>
            {graphNames.map((name, key) =>
                <SidebarMenuButton
                    className="group-data-[state=collapsed]:hidden cursor-pointer"
                    key={key}
                    onClick={() => loadGraph(name)}
                >
                    {name}
                </SidebarMenuButton>
            )}

            {showSpinner ?
                <div className="flex justify-center mr-3 mt-10 items-center gap-2">
                    <Spinner className="size-6 text-gray-700" />
                    <p className="text-gray-700"> Loading...</p>
                </div>
                : null}
        </SidebarMenu>
    )
}