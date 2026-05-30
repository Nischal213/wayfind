import { GeminiResponse } from "@/lib/types";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

interface GeminiError {
    status: number
}

const isGeminiError = (e: unknown): e is GeminiError => {
    return typeof e === "object" && e !== null && "status" in e
}


export async function POST(request : NextRequest) {
    const { prompt } = await request.json()

    const ai = new GoogleGenAI({ apiKey : process.env.GEMINI_API_KEY })

    try {
        const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        config : {
            systemInstruction: `
            You are a graph extraction engine. Convert ANY user message into a JSON graph of nodes and edges.

            ## Output Format
            Return ONLY a raw JSON object — no markdown, no code fences, no explanation.

            {
            "valid": boolean,
            "nodes": [{ "id": "lowercase id", "label": "Display Label" }],
            "edges": [{ "source": "id", "target": "id", "distance": "string" }]
            }

            ## Core Rule
            Set valid: false ONLY for messages completely unrelated to graphs — e.g. "tell me a joke", "what's the weather today". Everything else returns valid: true with best-effort extraction.

            ## Extraction Rules
            1. Any mention of named things (places, people, concepts, items) → create a node for each.
            2. Only create an edge if the user explicitly provides a distance or weight for it. If a connection is mentioned but no distance is given, drop the edge entirely — do not create it.
            3. Casual phrasing like "make", "add", "can u", "pls", "gimme", "create" are all valid create-node commands.
            4. If no valid edges exist, return edges: [].
            5. Node IDs must be lowercase (e.g. "new york"). Labels make the first character uppercase (e.g. "New york").
            6. Only create bidirectional edges if the user explicitly says "between", "and", or otherwise implies both directions. Phrases like "from X to Y" are one-directional — create only one edge from source to target.
            7. All node labels must be unique (case-insensitive). If the user provides duplicate names, only create one node for that name.
            8. Distance must always be a plain number formatted as a string with no units (e.g. "20", "340", "150"). Strip any units like "km", "miles", "m" from the value.

            ## Examples

            User: "can u make me 3 nodes italy france and paris"
            {"valid":true,"nodes":[{"id":"italy","label":"Italy"},{"id":"france","label":"France"},{"id":"paris","label":"Paris"}],"edges":[]}

            User: "connect london to paris"
            {"valid":true,"nodes":[{"id":"london","label":"London"},{"id":"paris","label":"Paris"}],"edges":[]}

            User: "connect london to paris 200km"
            {"valid":true,"nodes":[{"id":"london","label":"London"},{"id":"paris","label":"Paris"}],"edges":[{"source":"london","target":"paris","distance":"200km"},{"source":"paris","target":"london","distance":"200"}]}

            User: "add london, connect it to paris 340km"
            {"valid":true,"nodes":[{"id":"london","label":"London"},{"id":"paris","label":"Paris"}],"edges":[{"source":"london","target":"paris","distance":"340km"},{"source":"paris","target":"london","distance":"340"}]}

            User: "what's the weather"
            {"valid":false,"nodes":[],"edges":[]}

            User: "connect new york to mexico 200km"
            {"valid":true,"action":"create","nodes":[{"id":"new_york","label":"New York"},{"id":"mexico","label":"Mexico"}],"edges":[{"source":"new_york","target":"mexico","distance":"200"}]}

            User: "add london, connect it to paris 340km"
            {"valid":true,"action":"create","nodes":[{"id":"london","label":"London"},{"id":"paris","label":"Paris"}],"edges":[{"source":"london","target":"paris","distance":"340"},{"source":"paris","target":"london","distance":"340"}]}

            User: "node node node node"
            {"valid":true,"nodes":[{"id":"node","label":"Node"}],"edges":[]}

            User: "connect new york to mexico 200km"
            {"valid":true,"action":"create","nodes":[{"id":"new york","label":"New York"},{"id":"mexico","label":"Mexico"}],"edges":[{"source":"new york","target":"mexico","distance":"200"}]}

            User: "connect new york and mexico 200km"
            {"valid":true,"action":"create","nodes":[{"id":"new york","label":"New York"},{"id":"mexico","label":"Mexico"}],"edges":[{"source":"new york","target":"mexico","distance":"200"},{"source":"mexico","target":"new york","distance":"200"}]}

            User: "database connects to server and server connects to client"
            {"valid":true,"nodes":[{"id":"database","label":"Database"},{"id":"server","label":"Server"},{"id":"client","label":"Client"}],"edges":[]}
            `
        },
        contents : prompt
        })

        console.log(response.text)

        if (response.text) {
            const cleanedResponse : GeminiResponse = JSON.parse(response.text)

            return NextResponse.json(cleanedResponse)
        } else {
            const emptyResponse : GeminiResponse = {
                valid : false,
                nodes : [],
                edges : []
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
            { error : "Something went wrong with Gemini's servers!" } , 
            { status : 502 }
        )
    }
}