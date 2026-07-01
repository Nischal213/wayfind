import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GeminiResponse, ToolSideBarProps } from "@/lib/types";
import { useRef, useState } from "react";
import { saveGraph } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import { normalizeNodes, normalizeEdges } from "@/lib/algorithms/cleanGeminiOutput";
import { useUser } from "@clerk/nextjs";
import { featuresTable } from "@/lib/stripe/constants";
import { showToast } from "@/lib/utils";

interface Failure {
    error: string
    status: number
}

export const ChatWindow = (props: ToolSideBarProps) => {
    const { userTier, nodes, setNodes, edges, setEdges, currentGraph } = props
    const { screenToFlowPosition } = useReactFlow()
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const [loading, setLoading] = useState(false)
    const { user } = useUser()
    const email = user?.primaryEmailAddress?.emailAddress

    const sendMessage = async () => {
        setLoading(true)

        if (!email) {
            setLoading(false)
            showToast("Please wait for clerk to finish loading!", "warning")
            return
        }

        if (nodes.length === featuresTable[userTier].max_nodes_per_graph) {
            showToast("You have reached the maximum number of nodes.", "warning")
            setLoading(false)
            return
        }

        const prompt = textAreaRef?.current?.value

        if (typeof prompt === "undefined" || prompt.trim() === "") {
            setLoading(false)
            showToast("Prompts can't be empty!", "warning")
            return
        }

        textAreaRef.current!.value = ""

        try {
            const response = await fetch("/api/gemini",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt, email })
                }
            )

            if (!response.ok) {
                const err: Failure = await response.json()
                setLoading(false)
                showToast(err.error, "error")
                return
            }

            const data: GeminiResponse = await response.json()

            if (data.valid) {

                if (data.nodes.length && data.action !== "delete") {
                    const normalNodes = normalizeNodes(nodes, data.nodes, screenToFlowPosition)

                    if (nodes.length + normalNodes.length > featuresTable[userTier].max_nodes_per_graph) {
                        showToast("Reached the maximum number of nodes allowed for your plan.", "warning")
                        setLoading(false)
                        return
                    }

                    const save = [...nodes, ...normalNodes]
                    const error = await saveGraph(
                        email,
                        currentGraph,
                        save,
                        undefined
                    )

                    if (error) { showToast(error, "error"); return }
                    setNodes(save)
                }

                if (data.deleteNodes.length && data.action !== "create") {
                    const deleteNodesSet = new Set(data.deleteNodes)
                    const save1 = nodes.filter((node) => !deleteNodesSet.has(node.id))
                    const save2 = edges.filter((edge) =>
                        !deleteNodesSet.has(edge.source) &&
                        !deleteNodesSet.has(edge.target)
                    )
                    const error = await saveGraph(
                        email,
                        currentGraph,
                        save1,
                        save2
                    )

                    if (error) { showToast(error, "error"); return }
                    setNodes(save1)
                    setEdges(save2)
                }

                if (data.edges.length && data.action !== "delete") {
                    const normalEdges = normalizeEdges(edges, data.edges)
                    const save = [...edges, ...normalEdges]
                    const error = await saveGraph(
                        email,
                        currentGraph,
                        undefined,
                        save
                    )

                    if (error) { showToast(error, "error"); return }
                    setEdges(save)
                }

                if (data.deleteEdges.length && data.action !== "create") {
                    const deleteEdgesSet = new Set(data.deleteEdges.map((edge) => `${edge.source}-${edge.target}`))
                    const save = edges.filter((edge) => !deleteEdgesSet.has(edge.id))
                    const error = await saveGraph(
                        email,
                        currentGraph,
                        undefined,
                        save
                    )

                    if (error) { showToast(error, "error"); return }
                    setEdges(save)
                }

                setLoading(false)
                return
            } else {
                setLoading(false)
                return
            }
        } catch {
            setLoading(false)
        }

    }

    return (
        <div className="flex flex-col w-[90%] gap-2 mx-auto mt-auto mb-3">
            <Textarea
                ref={textAreaRef}
                disabled={loading}
                className="resize-none h-40"
                placeholder="Describe the graph you want to build..."
            />
            <Button className="cursor-pointer" disabled={loading} onClick={sendMessage}>
                {loading ? "Sending" : "Send a message"}
            </Button>
        </div>
    )
}