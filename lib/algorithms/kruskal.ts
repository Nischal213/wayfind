import { Node, Edge } from "@xyflow/react";

class DisjointSet {
    private table: Record<string, { parent: string, rank: number }> = {}

    constructor(nodes: Node[]) {
        nodes.forEach((node) => {
            this.table[node.id] ??= { parent: node.id, rank: 0 }
        })
    }

    find(nodeId: string) {
        if (this.table[nodeId].parent !== nodeId) {
            // Using path compression technique so faster look up
            // when the same node's root has to be found again
            this.table[nodeId].parent = this.find(this.table[nodeId].parent)
        }
        return this.table[nodeId].parent
    }

    union(node1Id: string, node2Id: string) {
        const root1 = this.find(node1Id)
        const root2 = this.find(node2Id)

       
        if (this.table[root1].rank > this.table[root2].rank) {
            this.table[root2].parent = root1
        } else if (this.table[root1].rank < this.table[root2].rank) {
            this.table[root1].parent = root2
        } else {
            this.table[root2].parent = root1
            this.table[root1].rank++
        }
    
    }
}

// Using kruskal algorithm instead of prims because it handles isolated nodes
// more elegantly compared to prims algorithm
export const kruskal = (nodes: Node[], edges: Edge[]) => {
    const sortedEdges = [...edges].sort((edge1, edge2) => Number(edge1.label) - Number(edge2.label))
    const disjointSet = new DisjointSet(nodes)
    const mstEdges: Edge[] = []

    sortedEdges.forEach((edge) => {
        // We only add this edge to mstEdge if there is no cycle detected
        if (disjointSet.find(edge.source) !== disjointSet.find(edge.target)) {
            mstEdges.push(edge)
            disjointSet.union(edge.source, edge.target)
        }
    })

    return mstEdges
}