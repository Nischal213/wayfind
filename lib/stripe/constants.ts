import { Tiers } from "./types"

// Daily chatbot interactions is handled in app/api/gemini/route.ts
interface TierFeatures {
    max_nodes_per_graph: number
    max_saved_graphs: number
}

export const featuresTable: Record<Tiers, TierFeatures> = {
    "": { max_nodes_per_graph: 0, max_saved_graphs: 0 },
    "free": { max_nodes_per_graph: 10, max_saved_graphs: 3 },
    "pro": { max_nodes_per_graph: 25, max_saved_graphs: 50 },
    "max": { max_nodes_per_graph: 50, max_saved_graphs: Infinity }
}