import { create } from 'zustand'
import { MindMapData, MindMapNode, Position, MindMapConnection } from '@/types/mind-map'
import { v4 as uuidv4 } from 'uuid'

interface MindMapState extends MindMapData {
  title: string
  zoom: number
  isAnyNodeEditing: boolean
  justBlurredFromNode: boolean
  canvasOffset: Position
}

interface HistoryState {
  past: MindMapState[]
  present: MindMapState
  future: MindMapState[]
}

interface MindMapStore extends HistoryState {
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
  updateTitle: (title: string) => void
  // History actions
  undo: () => void
  redo: () => void
  saveSnapshot: () => void
  // Persistence actions
  saveMindMap: () => void
  exportAsPng: () => void
  exportAsJson: () => void
  setCanvasOffset: (offset: Position) => void
}

const useMindMapStore = create<MindMapStore>((set, get) => ({
  past: [],
  present: {
    nodes: {},
    connections: {},
    rootNodeId: null,
    zoom: 1,
    isAnyNodeEditing: false,
    justBlurredFromNode: false,
    title: 'Untitled Mind Map',
    canvasOffset: { x: 0, y: 0 },
  },
  future: [],

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
    console.log('Current connections:', get().present.connections)

    set(state => {
      const newNodes = { ...state.present.nodes, [id]: newNode };
      let newConnections = { ...state.present.connections };
      let newRootNodeId = state.present.rootNodeId;

      // If it's a child node, update parent's children array and add connection
      if (parentId) {
        const parentNode = { ...state.present.nodes[parentId] };
        parentNode.children = [...parentNode.children, id];
        newNodes[parentId] = parentNode;

        const connectionId = uuidv4();
        const newConnection: MindMapConnection = {
          id: connectionId,
          sourceId: parentId,
          targetId: id,
          type: 'curved',
        };
        newConnections = { ...newConnections, [connectionId]: newConnection };
      } else if (!state.present.rootNodeId) {
        // If it's the first node created
        newRootNodeId = id;
      }

      return {
        present: {
          ...state.present,
          nodes: newNodes,
          connections: newConnections,
          rootNodeId: newRootNodeId,
        },
      };
    });
    get().saveSnapshot();
  },

  updateNodePosition: (nodeId, position) => {
    set(state => ({
      present: {
        ...state.present,
        nodes: {
          ...state.present.nodes,
          [nodeId]: {
            ...state.present.nodes[nodeId],
            position,
          },
        },
      },
    }));
    get().saveSnapshot();
  },

  updateNodeTitle: (nodeId, title) => {
    set(state => ({
      present: {
        ...state.present,
        nodes: {
          ...state.present.nodes,
          [nodeId]: {
            ...state.present.nodes[nodeId],
            title,
          },
        },
      },
    }));
    get().saveSnapshot();
  },

  deleteNode: (nodeId) => {
    set(state => {
      const node = state.present.nodes[nodeId];
      const newNodes = { ...state.present.nodes };
      const newConnections = { ...state.present.connections };

      // Delete all child nodes recursively
      const deleteChildren = (id: string) => {
        const children = newNodes[id]?.children || [];
        children.forEach((childId) => {
          deleteChildren(childId);
          delete newNodes[childId];
        });
      };

      deleteChildren(nodeId);
      delete newNodes[nodeId];

      // Delete all connections involving this node
      Object.values(newConnections).forEach(connection => {
        if (connection.sourceId === nodeId || connection.targetId === nodeId) {
          delete newConnections[connection.id];
        }
      });

      // If it's a child node, remove it from parent's children array
      if (node?.parentId && newNodes[node.parentId]) { // Check if parent still exists
        const parentNode = { ...newNodes[node.parentId] };
        parentNode.children = parentNode.children.filter(id => id !== nodeId);
        newNodes[node.parentId] = parentNode;
      }

      return {
        present: {
          ...state.present,
          nodes: newNodes,
          connections: newConnections,
          rootNodeId: state.present.rootNodeId === nodeId ? null : state.present.rootNodeId,
        },
      };
    });
    get().saveSnapshot();
  },

  addConnection: (sourceId, targetId) => {
    const id = uuidv4();
    set(state => ({
      present: {
        ...state.present,
        connections: {
          ...state.present.connections,
          [id]: {
            id,
            sourceId,
            targetId,
            type: 'curved',
          },
        },
      },
    }));
    get().saveSnapshot();
  },

  deleteConnection: (connectionId) => {
    set(state => {
      const newConnections = { ...state.present.connections };
      delete newConnections[connectionId];
      return {
        present: {
          ...state.present,
          connections: newConnections,
        },
      };
    });
    get().saveSnapshot();
  },

  zoomIn: () => {
    set(state => ({
      present: {
        ...state.present,
        zoom: Math.min(state.present.zoom + 0.1, 2),
      },
    }));
   // No snapshot for view actions like zoom
  },

  zoomOut: () => {
    set(state => ({
      present: {
        ...state.present,
        zoom: Math.max(state.present.zoom - 0.1, 0.5),
      },
    }));
   // No snapshot for view actions like zoom
  },

  resetView: () => {
    set(state => ({
      present: {
        ...state.present,
        zoom: 1,
      },
    }));
   // No snapshot for view actions like zoom
  },

  setIsAnyNodeEditing: (editing) => {
    set(state => ({
      present: {
        ...state.present,
        isAnyNodeEditing: editing,
      },
    }));
   // No snapshot for temporary state changes
  },

  setJustBlurredFromNode: (blurred) => {
    set(state => ({
      present: {
        ...state.present,
        justBlurredFromNode: blurred,
      },
    }));
   // No snapshot for temporary state changes
  },

  updateTitle: (title) => {
    set(state => ({
      present: {
        ...state.present,
        title: title,
      },
    }));
    get().saveSnapshot();
  },

  // History actions
  saveSnapshot: () => set(state => {
    const { nodes, connections, rootNodeId, title, zoom, isAnyNodeEditing, justBlurredFromNode, canvasOffset } = state.present;
    return {
      past: [...state.past, state.present],
      present: { nodes, connections, rootNodeId, title, zoom, isAnyNodeEditing, justBlurredFromNode, canvasOffset },
      future: [],
    };
  }),

  undo: () => set(state => {
    const { past, present, future } = state;
    if (past.length === 0) return state;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    return {
      past: newPast,
      present: previous,
      future: [present, ...future],
    };
  }),

  redo: () => set(state => {
    const { past, present, future } = state;
    if (future.length === 0) return state;
    const next = future[0];
    const newFuture = future.slice(1);
    return {
      past: [...past, present],
      present: next,
      future: newFuture,
    };
  }),

  // Persistence actions (placeholder)
  saveMindMap: () => {
    console.log('Saving mind map...');
    // TODO: Implement save logic (e.g., to local storage or a backend)
  },

  exportAsPng: () => {
    console.log('Exporting as PNG...');
    // TODO: Implement PNG export logic
  },

  exportAsJson: () => {
    console.log('Exporting as JSON...');
    // TODO: Implement JSON export logic
    const { nodes, connections, rootNodeId, title } = get().present;
    const mindMapData: MindMapData = { nodes, connections, rootNodeId };
    const exportData = { title, data: mindMapData };
    const jsonString = JSON.stringify(exportData, null, 2);
    console.log(jsonString);
    // TODO: Provide JSON file to user for download
  },

  setCanvasOffset: (offset) => {
    set(state => ({
      present: {
        ...state.present,
        canvasOffset: offset,
      },
    }));
    // We might not want to save a snapshot on every minor drag movement,
    // but rather only on drag end. Let's hold off on saveSnapshot here.
  },
}))

export default useMindMapStore 