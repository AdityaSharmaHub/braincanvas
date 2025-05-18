import { create } from 'zustand'
import { MindMapData, MindMapNode, Position, MindMapConnection } from '@/types/mind-map'
import { v4 as uuidv4 } from 'uuid'

interface MindMapStore extends MindMapData {
  zoom: number
  isAnyNodeEditing: boolean
  justBlurredFromNode: boolean
  // Actions
  addNode: (parentId: string | null, position: Position) => void
  updateNodePosition: (nodeId: string, position: Position) => void
  updateNodeTitle: (nodeId: string, title: string) => void
  deleteNode: (nodeId: string) => void
  addConnection: (sourceId: string, targetId: string) => void
  deleteConnection: (connectionId: string) => void
  // View actions
  zoomIn: () => void
  zoomOut: () => void
  resetView: () => void
  setIsAnyNodeEditing: (editing: boolean) => void
  setJustBlurredFromNode: (blurred: boolean) => void
}

const useMindMapStore = create<MindMapStore>((set, get) => ({
  nodes: {},
  connections: {},
  rootNodeId: null,
  zoom: 1,
  isAnyNodeEditing: false,
  justBlurredFromNode: false,

  addNode: (parentId, position) => {
    const id = uuidv4()
    const newNode: MindMapNode = {
      id,
      type: parentId === null ? 'root' : 'child',
      title: 'New Node',
      position,
      parentId,
      children: [],
    }

    console.log('Adding new node:', newNode)
    console.log('Current connections:', get().connections)

    set((state) => {
      const newNodes = { ...state.nodes, [id]: newNode }
      let newConnections = { ...state.connections }
      
      // If it's a child node, update parent's children array
      if (parentId) {
        const parentNode = { ...state.nodes[parentId] }
        parentNode.children = [...parentNode.children, id]
        newNodes[parentId] = parentNode

        // Add a connection between parent and child
        const connectionId = uuidv4()
        const newConnection: MindMapConnection = {
          id: connectionId,
          sourceId: parentId,
          targetId: id,
          type: 'curved',
        }
        newConnections = { ...newConnections, [connectionId]: newConnection }
        console.log('Created new connection:', newConnection)
      }

      console.log('New connections after adding:', newConnections)

      return {
        nodes: newNodes,
        connections: newConnections,
        // Only set rootNodeId if this is the first node (parentId is null and there's no root yet)
        rootNodeId: parentId === null && !state.rootNodeId ? id : state.rootNodeId,
      }
    })
  },

  updateNodePosition: (nodeId, position) => {
    set((state) => ({
      nodes: {
        ...state.nodes,
        [nodeId]: {
          ...state.nodes[nodeId],
          position,
        },
      },
    }))
  },

  updateNodeTitle: (nodeId, title) => {
    set((state) => ({
      nodes: {
        ...state.nodes,
        [nodeId]: {
          ...state.nodes[nodeId],
          title,
        },
      },
    }))
  },

  deleteNode: (nodeId) => {
    set((state) => {
      const node = state.nodes[nodeId]
      const newNodes = { ...state.nodes }
      const newConnections = { ...state.connections }

      // Delete all child nodes recursively
      const deleteChildren = (id: string) => {
        const children = state.nodes[id].children
        children.forEach((childId) => {
          deleteChildren(childId)
          delete newNodes[childId]
        })
      }

      deleteChildren(nodeId)
      delete newNodes[nodeId]

      // Delete all connections involving this node
      Object.values(state.connections).forEach((connection) => {
        if (connection.sourceId === nodeId || connection.targetId === nodeId) {
          delete newConnections[connection.id]
        }
      })

      // If it's a child node, remove it from parent's children array
      if (node.parentId) {
        const parentNode = { ...state.nodes[node.parentId] }
        parentNode.children = parentNode.children.filter((id) => id !== nodeId)
        newNodes[node.parentId] = parentNode
      }

      return {
        nodes: newNodes,
        connections: newConnections,
        rootNodeId: state.rootNodeId === nodeId ? null : state.rootNodeId,
      }
    })
  },

  addConnection: (sourceId, targetId) => {
    const id = uuidv4()
    set((state) => ({
      connections: {
        ...state.connections,
        [id]: {
          id,
          sourceId,
          targetId,
          type: 'curved',
        },
      },
    }))
  },

  deleteConnection: (connectionId) => {
    set((state) => {
      const newConnections = { ...state.connections }
      delete newConnections[connectionId]
      return { connections: newConnections }
    })
  },

  zoomIn: () => {
    set((state) => ({
      ...state,
      zoom: Math.min(state.zoom + 0.1, 2),
    }))
  },

  zoomOut: () => {
    set((state) => ({
      ...state,
      zoom: Math.max(state.zoom - 0.1, 0.5),
    }))
  },

  resetView: () => {
    set((state) => ({
      ...state,
      zoom: 1,
    }))
  },

  setIsAnyNodeEditing: (editing) => {
    set((state) => ({
      ...state,
      isAnyNodeEditing: editing,
    }))
  },

  setJustBlurredFromNode: (blurred) => {
    set((state) => ({
      ...state,
      justBlurredFromNode: blurred,
    }))
  },
}))

export default useMindMapStore 