"use client"

import * as React from 'react'
import { useRef } from 'react'
import { MindMapNode } from './mind-map-node'
import { MindMapConnection } from './mind-map-connection'
import useMindMapStore from '@/store/mind-map-store'
import { MindMapNode as NodeType } from '@/types/mind-map'

export function MindMapCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const { nodes, connections, addNode, rootNodeId, isAnyNodeEditing, justBlurredFromNode, setJustBlurredFromNode } = useMindMapStore()
  const lastEditExitTime = useRef(0);

  // Update the ref whenever editing stops
  React.useEffect(() => {
    if (!isAnyNodeEditing) {
      lastEditExitTime.current = Date.now();
    }
  }, [isAnyNodeEditing]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    // If a node just blurred, consume this click event
    if (justBlurredFromNode) {
      console.log("Canvas click consumed after node blur.");
      setJustBlurredFromNode(false);
      return;
    }

    // If any node is currently being edited, prevent canvas clicks from creating new nodes.
    // The blur event on the editor will handle saving and exiting editing.
    if (isAnyNodeEditing) {
      return;
    }

    // Check if we clicked on the canvas or its background
    const target = e.target as HTMLElement
    
    // Don't create a new node if we clicked on any element that is a descendant of a mind-map-node or the rich text editor container.
    if (
      target.closest('.mind-map-node') || 
      target.closest('.rsw-editor') // Rich text editor container (react-simple-wysiwyg specific)
      // Removed specific checks for input, button, tooltip as they should be within .mind-map-node or handled by rsw-editor check
    ) {
      // console.log("Click ignored due to target being within node or editor.");
      return
    }

    // Only create a node if we clicked directly on the canvas or its grid background
    if (!canvasRef.current?.contains(target)) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // If there are no nodes, create a root node
    if (!rootNodeId) {
      addNode(null, { x, y })
    } else {
      // Create a child node connected to the root
      addNode(rootNodeId, { x, y })
    }
  }

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full bg-background"
      onClick={handleCanvasClick}
    >
      {/* Grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(#ddd_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Connections layer */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {Object.values(connections).map((connection) => (
          <MindMapConnection key={connection.id} connection={connection} />
        ))}
      </div>
      
      {/* Nodes layer */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        {Object.values(nodes).map((node: NodeType) => (
          <MindMapNode key={node.id} node={node} />
        ))}
      </div>

      {/* Empty state */}
      {!rootNodeId && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 3 }}>
          <div className="text-muted-foreground text-sm">
            Click anywhere to create your first node
          </div>
        </div>
      )}
    </div>
  )
} 