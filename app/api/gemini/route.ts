import { supabaseAdmin } from "@/lib/supabase/admin";
import { GeminiResponse } from "@/lib/types";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

interface GeminiError {
    status: number
}

interface CreditResponse {
    allowed: boolean
    current_usage: number
    max_limit: number
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const isGeminiError = (e: unknown): e is GeminiError => {
    return typeof e === "object" && e !== null && "status" in e
}

export async function POST(request: NextRequest) {
    const { prompt, email } = await request.json()

    const { data, error } = await supabaseAdmin
        .rpc('get_credits', {
            user_email_param: email
        })
        .single()
        .overrideTypes<CreditResponse>()

    if (!data || error) return NextResponse.json({ error: error?.message || "Something went wrong!" }, { status: 400 })


    if (!data.allowed) {
        return NextResponse.json({ error: `Limit reached. You've used ${data.current_usage}/${data.max_limit} AI generations today.` }, { status: 429 })
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction: `
            You are a graph extraction engine. Convert ANY user message into a JSON graph operation.

            ## Output Format
            Return ONLY a raw JSON object — no markdown, no code fences, no explanation.

            {
            "valid": boolean,
            "action": "create" | "delete" | "mixed",
            "nodes": [{ "id": "lowercase id", "label": "Display Label" }],
            "edges": [{ "source": "id", "target": "id", "cost": "string" }],
            "deleteNodes": ["id1", "id2"],
            "deleteEdges": [{ "source": "id", "target": "id" }]
            }

            ## Core Rule
            Set valid: false ONLY for messages completely unrelated to graphs — e.g. "tell me a joke", "what's the weather today". Everything else returns valid: true with best-effort extraction.

            ## Action Rules
            - Use "create" if the message only adds nodes/edges.
            - Use "delete" if the message only removes nodes/edges.
            - Use "mixed" if the message both adds and removes in the same request.
            - Always include both "nodes"/"edges" (for creates) and "deleteNodes"/"deleteEdges" keys in every response — use empty arrays for whichever side has nothing to do.

            ## Creation Rules
            1. Any mention of named things (places, people, concepts, items) → create a node for each.
            2. Only create an edge if the user explicitly provides a cost. If a connection is mentioned but no cost is given, drop the edge — do not create it.
            3. Casual phrasing like "make", "add", "can u", "pls", "gimme", "create" are all valid create-node commands.
            4. Node IDs must be lowercase with spaces preserved (e.g. "new york"). Labels capitalise the first letter of each word (e.g. "New York").
            5. All node labels must be unique (case-insensitive). If the user provides duplicate names, only create one node.
            6. Cost must always be a plain number as a string with no units (e.g. "200", "-50", "340"). Strip any units like "km", "miles". Negative costs are valid and must be preserved as-is (e.g. "-75").
            7. Only create bidirectional edges if the user says "between", "and", or implies both directions. "from X to Y" is one-directional only.

            ## Deletion Rules
            1. Deletion keywords: "remove", "delete", "erase", "get rid of", "drop".
            2. To delete a node, add its id to deleteNodes. Do NOT add it to the top-level nodes array.
            3. To delete an edge, add a { source, target } object to deleteEdges.
            4. Deleting a node implicitly deletes all its connected edges — your consumer will handle this, so only list the node ID.
            5. If the user says "remove the edge between X and Y", add both directions to deleteEdges. If they say "remove the edge from X to Y", add only that one direction.
            6. If a node is mentioned only in a delete context, do NOT create a node entry for it — only reference it in deleteNodes.

            ## Examples

            User: "can u make me 3 nodes italy france and paris"
            {"valid":true,"action":"create","nodes":[{"id":"italy","label":"Italy"},{"id":"france","label":"France"},{"id":"paris","label":"Paris"}],"edges":[],"deleteNodes":[],"deleteEdges":[]}

            User: "connect london to paris 200"
            {"valid":true,"action":"create","nodes":[{"id":"london","label":"London"},{"id":"paris","label":"Paris"}],"edges":[{"source":"london","target":"paris","cost":"200"}],"deleteNodes":[],"deleteEdges":[]}

            User: "connect new york and mexico 200"
            {"valid":true,"action":"create","nodes":[{"id":"new york","label":"New York"},{"id":"mexico","label":"Mexico"}],"edges":[{"source":"new york","target":"mexico","cost":"200"},{"source":"mexico","target":"new york","cost":"200"}],"deleteNodes":[],"deleteEdges":[]}

            User: "connect berlin to rome with cost -50"
            {"valid":true,"action":"create","nodes":[{"id":"berlin","label":"Berlin"},{"id":"rome","label":"Rome"}],"edges":[{"source":"berlin","target":"rome","cost":"-50"}],"deleteNodes":[],"deleteEdges":[]}

            User: "delete paris"
            {"valid":true,"action":"delete","nodes":[],"edges":[],"deleteNodes":["paris"],"deleteEdges":[]}

            User: "remove london and new york"
            {"valid":true,"action":"delete","nodes":[],"edges":[],"deleteNodes":["london","new york"],"deleteEdges":[]}

            User: "remove the edge from london to paris"
            {"valid":true,"action":"delete","nodes":[],"edges":[],"deleteNodes":[],"deleteEdges":[{"source":"london","target":"paris"}]}

            User: "remove the edge between london and paris"
            {"valid":true,"action":"delete","nodes":[],"edges":[],"deleteNodes":[],"deleteEdges":[{"source":"london","target":"paris"},{"source":"paris","target":"london"}]}

            User: "add rome, delete paris"
            {"valid":true,"action":"mixed","nodes":[{"id":"rome","label":"Rome"}],"edges":[],"deleteNodes":["paris"],"deleteEdges":[]}

            User: "connect berlin to rome 150, remove the edge from london to paris"
            {"valid":true,"action":"mixed","nodes":[{"id":"berlin","label":"Berlin"},{"id":"rome","label":"Rome"}],"edges":[{"source":"berlin","target":"rome","cost":"150"}],"deleteNodes":[],"deleteEdges":[{"source":"london","target":"paris"}]}

            User: "what's the weather"
            {"valid":false,"action":"create","nodes":[],"edges":[],"deleteNodes":[],"deleteEdges":[]}
            
            User: "tell me a joke about nodes"
            {"valid":false,"action":"create","nodes":[],"edges":[],"deleteNodes":[],"deleteEdges":[]}

            User: "what's the shortest path from london to paris?"
            {"valid":false,"action":"create","nodes":[],"edges":[],"deleteNodes":[],"deleteEdges":[]}
            `
            },
            contents: prompt
        })

        console.log("Gemini says: ", response.text)

        if (response.text) {
            const cleanedResponse: GeminiResponse = JSON.parse(response.text)

            return NextResponse.json(cleanedResponse)
        } else {
            const emptyResponse: GeminiResponse = {
                valid: false,
                // Random action. Empty responses are immediately filtered out
                // by the valid flag.
                action: "create",
                nodes: [],
                edges: [],
                deleteNodes: [],
                deleteEdges: []
            }

            return NextResponse.json(emptyResponse)
        }

    } catch (e) {

        console.log(e)

        if (isGeminiError(e) && e.status === 429) {
            return NextResponse.json(
                { error: "Gemini rate limit reached, try again later!" },
                { status: 429 }
            )
        }

        return NextResponse.json(
            { error: "Something went wrong with Gemini's servers!" },
            { status: 503 }
        )
    }
}