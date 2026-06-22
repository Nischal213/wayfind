import { Edge, Node } from "@xyflow/react";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";

// How the algorithm works:
//   1. For every node, pick its single cheapest incoming edge.
//   2. If this greedy selection forms no cycle → we're done because it's 
//      already a valid tree.
//   3. If it forms we:
//        a. contract the cycle into a single super node.
//        b. adjust the weights of edges entering the super node to account
//           for the cycle edge they'd be replacing.
//        c. recurse on the smaller graph.
//        d. extract the result back: every cycle edge stays except the one
//           whose target got a new parent from outside.

type NodeLike = Node | Pick<Node, "id">

interface SuperNodeInfo {
    // The cycle edges that were merged into this super-node.
    // Needed during extraction phase to re-introduce all but one of them.
    contractedCycleEdges: Edge[]

    // Real target inside the cycle
    enteredFrom: Record<string, string>

    // Real source inside the cycle
    leftFrom: Record<string, string>
}

// Keeping track of the super nodes outside of the recursion phase
const superNodeTable: Record<string, SuperNodeInfo> = {}

let recursionCounter = 0


// Step 1
// For each target node, find the single minimum-weight edge pointing to it.
const makeCheapestTable = (edges: Edge[]): Record<string, Edge> => {
    const edgeQueue = new MinPriorityQueue<Edge>({
        compare: (a: Edge, b: Edge) => Number(a.label) - Number(b.label)
    })

    edges.forEach((edge) => edgeQueue.enqueue(edge))

    // Maps targetNodeId -> cheapest edge pointing at that target
    const cheapestTable: Record<string, Edge> = {}

    while (edgeQueue.size()) {
        const edge = edgeQueue.dequeue()!

        cheapestTable[edge.target] ??= edge
    }

    return cheapestTable
}


const detectCycle = (cheapestIncoming: Record<string, Edge>): Edge[] => {

    // Tracks nodes whose entire chain has already been inspected without
    // finding a new cycle so no need to go through them again.
    const fullyResolved = new Set<string>()

    for (const startNode of Object.keys(cheapestIncoming)) {
        if (fullyResolved.has(startNode)) continue

        const currentPath: Edge[] = []
        const visitedOnCurrentWalk = new Set<string>()

        let currentNode = startNode

        while (cheapestIncoming[currentNode] && !fullyResolved.has(currentNode)) {
            if (visitedOnCurrentWalk.has(currentNode)) {
                const cycleStartIndex = currentPath.findIndex(
                    (edge) => edge.target === currentNode
                )
                return currentPath.slice(cycleStartIndex)
            }

            visitedOnCurrentWalk.add(currentNode)
            const parentEdge = cheapestIncoming[currentNode]
            currentPath.push(parentEdge)
            currentNode = parentEdge.source
        }

        currentPath.forEach((edge) => fullyResolved.add(edge.target))
    }

    // Return an empty array to indicate there was no cycles
    return []
}


// Main function that actually runs chu liu edmond algorithm
const runChuLiuEdmonds = (nodes: NodeLike[], edges: Edge[]): Edge[] => {
    const cheapestIncoming = makeCheapestTable(edges)
    const cycleEdges = detectCycle(cheapestIncoming)

    // Step 2: No cycles detected so return the cheapest edges
    if (cycleEdges.length === 0) {
        return Object.values(cheapestIncoming)
    }

    // Step 3a: Contraction phase
    const superNodeId = `superNode${recursionCounter++}`
    const cycleNodeIds = new Set<string>(cycleEdges.map((edge) => edge.source))

    // For each cycle node, remember the weight of its cheapest incoming cycle edge
    const cycleTable: Record<string, number> = {}
    cycleEdges.forEach((edge) => {
        cycleTable[edge.target] = Number(edge.label)
    })

    const enteredFrom: Record<string, string> = {}
    const enteredFromLabel: Record<string, string> = {}
    const leftFrom: Record<string, string> = {}

    // Re-building the edges to prepare for recursion
    const edgesAfterContraction = edges
        // Remove any cycle edges and also any cycle edges within the super node
        .filter((edge) => !(cycleNodeIds.has(edge.source) && cycleNodeIds.has(edge.target)))

        .map((edge) => {
            // Edges leaving the super node only change source
            if (cycleNodeIds.has(edge.source)) {
                leftFrom[edge.id] = edge.source
                return { ...edge, source: superNodeId }
            }

            // Step 3b: Edges entering super node have their weights readjusted
            if (cycleNodeIds.has(edge.target)) {
                enteredFrom[edge.id] = edge.target
                enteredFromLabel[edge.id] = edge.label as string
                return {
                    ...edge,
                    target: superNodeId,
                    label: String(Number(edge.label) - cycleTable[edge.target])
                }
            }

            return edge
        })

    superNodeTable[superNodeId] = {
        contractedCycleEdges: cycleEdges,
        enteredFrom,
        leftFrom
    }

    // Re-building the nodes to prepare for recursion
    const nodesAfterContraction = [
        ...nodes.filter((node) => !cycleNodeIds.has(node.id)),
        { id: superNodeId }
    ]

    // Step 3c: recursion on smaller graph
    const resultFromRecursion = runChuLiuEdmonds(nodesAfterContraction, edgesAfterContraction)


    // Step 3d: extraction phase
    const info = superNodeTable[superNodeId]
    const expandedResult: Edge[] = []
    // Will be set to the real cycle node that the winning outside edge enters
    let cycleEntryNode: string | undefined

    for (const edge of resultFromRecursion) {
        if (edge.target === superNodeId) {
            // This outside edge was redirected to point at the super-node.
            // Restore it to point at the real cycle node it originally targeted.
            cycleEntryNode = info.enteredFrom[edge.id]
            expandedResult.push({ ...edge, target: cycleEntryNode, label: enteredFromLabel[edge.id] })
        } else if (edge.source === superNodeId) {
            // This edge left from the super-node. Restore its real source.
            expandedResult.push({ ...edge, source: info.leftFrom[edge.id] })
        } else {
            expandedResult.push(edge)
        }
    }

    // Re-introduce the cycle edges, skipping the one whose target is now
    // covered by the outside edge
    info.contractedCycleEdges
        .filter((edge) => edge.target !== cycleEntryNode)
        .forEach((edge) => expandedResult.push(edge))

    // Delete the entry, we don't need the super node anymore
    delete superNodeTable[superNodeId]

    return expandedResult
}



// We make a dummy root node because the algorithm requires at least one node
// to have no incoming edges and that isn't always guaranteed when users are
// drawing the graph.
const dummyRootName = "dummyRoot"

export const chuLiuEdmond = (nodes: NodeLike[], edges: Edge[]): Edge[] => {

    // Force the dummy root edges to be heavier than any real path
    const largestRealEdgeMagnitude = edges.reduce(
        (max, edge) => Math.max(max, Math.abs(Number(edge.label))),
        0
    )
    const dummyEdgeWeight = 1 + 2 * nodes.length * largestRealEdgeMagnitude

    // Connect dummy root node to all nodes
    const dummyEdges: Edge[] = nodes.map((node) => ({
        id: `${dummyRootName}-${node.id}`,
        source: dummyRootName,
        target: node.id,
        label: String(dummyEdgeWeight)
    }))

    const result = runChuLiuEdmonds(
        [...nodes, { id: dummyRootName }],
        [...edges, ...dummyEdges]
    )

    // After the mst is made, remove the dummy root node, no need
    // to render it on the whiteboard.
    return result.filter((edge) => edge.source !== dummyRootName)
}