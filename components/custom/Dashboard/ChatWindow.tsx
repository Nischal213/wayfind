import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GeminiResponse, WhiteboardProps } from "@/lib/types";
import { useRef, useState } from "react";
import { normalizeEdges, normalizeNodes } from "@/lib/utils";

interface Failure {
    error: string
    status: number
}

export const ChatWindow = (props: WhiteboardProps) => {
    const { nodes, setNodes, edges, setEdges } = props
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const sendMessage = async () => {
        setError("")
        setLoading(true)

        const prompt = textAreaRef?.current?.value

        if (typeof prompt === "undefined" || prompt.trim() === "") {
            setLoading(false)
            setError("Prompts can't be empty!")
            return
        }

        try {
            const response = await fetch("/api/gemini",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt })
                }
            )

            if (!response.ok) {
                const err: Failure = await response.json()
                setLoading(false)
                setError(`Error code ${response.status}: ${err.error}`)
                return
            }

            const data: GeminiResponse = await response.json()

            console.log(data)

            if (data.valid) {

                if (data.nodes.length && data.action !== "delete") {
                    const normalNodes = normalizeNodes(nodes, data.nodes)
                    console.log("Making nodes...")
                    setNodes((prevNodes) => [...prevNodes, ...normalNodes])
                }

                if (data.deleteNodes.length && data.action !== "create") {
                    const deleteNodesSet = new Set(data.deleteNodes)
                    console.log("Deleting nodes...")
                    setNodes((prevNodes) => prevNodes.filter((node) => !deleteNodesSet.has(node.id)))
                }

                if (data.edges.length && data.action !== "delete") {
                    const normalEdges = normalizeEdges(edges, data.edges)
                    console.log("Making edges...")
                    setEdges(normalEdges)
                }

                if (data.deleteEdges.length && data.action !== "create") {
                    const deleteEdgesSet = new Set(data.deleteEdges.map((edge) => `${edge.source}-${edge.target}`))
                    console.log("Deleting edges...")
                    setEdges((prevEdges) => prevEdges.filter((edge) => !deleteEdgesSet.has(edge.id)))
                }

                setLoading(false)
                return
            } else {
                setLoading(false)
                setError("No nodes or connections found!")
                return
            }
        } catch (e) {
            setLoading(false)
            setError("Error code 500: Internal server error!")
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

            {error ?
                <p className="text-red-600 text-center text-xs font-medium"> {error} </p>
                : null}

            <Button disabled={loading} onClick={sendMessage}>
                {loading ? "Sending" : "Send a message"}
            </Button>
        </div>
    )
}