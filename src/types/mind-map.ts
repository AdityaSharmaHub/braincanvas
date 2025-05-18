export interface Position {
  x: number
  y: number
}

export interface MindMapNode {
  id: string
  type: 'root' | 'child'
  title: string
  position: Position
  parentId: string | null
  children: string[] // Array of child node IDs
  style?: {
    color?: string
    backgroundColor?: string
    fontSize?: number
    fontWeight?: string
  }
}

export interface MindMapConnection {
  id: string
  sourceId: string
  targetId: string
  type: 'straight' | 'curved'
}

export interface MindMapData {
  nodes: Record<string, MindMapNode>
  connections: Record<string, MindMapConnection>
  rootNodeId: string | null
} 