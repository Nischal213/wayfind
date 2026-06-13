import { getGraphDetails } from "@/actions/getGraphDetails"
import { getUserRecentGraphs } from "@/actions/getUserRecentGraphs"
import { SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar"
import { Spinner } from "@/components/ui/spinner"
import { useAuth, useClerk } from "@clerk/nextjs"
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
    const [error, setError] = useState("")
    const { isLoaded, isSignedIn } = useAuth()
    const { user } = useClerk()
    const userEmail = user?.primaryEmailAddress?.emailAddress

    useEffect(() => {
        if (!isLoaded || !isSignedIn || !userEmail) return

        const getRecentGraphs = async () => {
            if (!userEmail) {
                setError("Clerk hasn't loaded in yet please wait!")
                return
            }

            const { success, error, result } = await getUserRecentGraphs(userEmail)

            if (!success) {
                setError(error)
                return
            } else {
                setGraphNames(result.graphs.map((graph) => graph.name))
                return
            }
        }

        getRecentGraphs()

    }, [isLoaded, isSignedIn, userEmail, setGraphNames])

    const loadGraph = async (graphName: string) => {
        const { success, error, result } = await getGraphDetails(userEmail!, graphName)

        if (!success) { setError(error); return }

        setCurrentGraph(graphName)
        setNodes(result.nodes)
        setEdges(result.edges)
    }

    return (
        <SidebarMenu>
            {error ?
                <p className="text-red-600 text-center"> {error} </p>
                :
                null}
            {graphNames.length ?
                graphNames.map((name, key) =>
                    <SidebarMenuButton className="group-data-[state=collapsed]:hidden" key={key} onClick={() => loadGraph(name)}>
                        {name}
                    </SidebarMenuButton>
                ) :
                <div className="flex justify-center mr-3 mt-10 items-center gap-2">
                    <Spinner className="size-6 text-gray-700" />
                    <p className="text-gray-700"> Loading...</p>
                </div>}
        </SidebarMenu>
    )
}