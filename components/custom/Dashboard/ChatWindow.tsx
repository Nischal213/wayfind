import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GeminiResponse, WhiteboardProps } from "@/lib/types";
import { useRef, useState } from "react";
import { excludeExistingNodes, normalizeEdges, normalizeNodes } from "@/lib/utils";

interface Failure {
    error : string
    status : number
}

export const ChatWindow = (props : WhiteboardProps) => {
    const {nodes , setNodes , edges , setEdges } = props
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const [loading , setLoading] = useState(false)
    const [error , setError] = useState("")

    const sendMessage = async() => {
        setError("")
        setLoading(true)

        const prompt = textAreaRef?.current?.value

        if (typeof prompt === "undefined" || prompt.trim() === "") {
            setLoading(false)
            setError("Prompts can't be empty!")
            return
        }

        try {
            const response = await fetch("/api/gemini" , 
                {
                    method : "POST",
                    headers : { "Content-Type" : "application/json"},
                    body : JSON.stringify({ prompt })
                }
            )

            if (!response.ok) {
                const err : Failure = await response.json()
                setLoading(false)
                setError(`Error code ${response.status}: ${err.error}`)
                return
            }

            const data : GeminiResponse = await response.json()

            console.log(data)

            if (data.valid) {
                if (data.nodes.length) {
                    const geminiNodes = excludeExistingNodes(nodes , data.nodes)
                    const normalNodes = normalizeNodes(geminiNodes)

                    setNodes((prevNodes) => [...prevNodes , ...normalNodes])
                    setLoading(false)
                }
                
                if (data.edges.length) {
                    const normalEdges = normalizeEdges(edges , data.edges)

                    setEdges(normalEdges)
                    setLoading(false)
                }
            } else {
                setLoading(false)
                setError("No nodes or connections found!")
                return
            }
        } catch (e) {
            console.log(e)
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

            { error? 
            <p className="text-red-600 text-center text-xs font-medium"> {error} </p> 
            : null}

            <Button disabled={loading} onClick={sendMessage}>
                { loading? "Sending" : "Send a message" }
            </Button>
        </div>
  )
}