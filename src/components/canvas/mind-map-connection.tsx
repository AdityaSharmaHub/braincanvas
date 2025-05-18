"use client"

import * as React from 'react'
import type { MindMapConnection as ConnectionType } from '@/types/mind-map.ts'
import useMindMapStore from '@/store/mind-map-store'

interface ConnectionProps {
  connection: ConnectionType
}

export function MindMapConnection({ connection }: ConnectionProps) {
  const { nodes, zoom } = useMindMapStore()
  const sourceNode = nodes[connection.sourceId]
  const targetNode = nodes[connection.targetId]

  if (!sourceNode || !targetNode) return null

  // Calculate the center points of the nodes in the zoomed coordinate space
  const sourceX = (sourceNode.position.x + 60) * zoom; // Scaled x-coordinate of source node center
  const sourceY = (sourceNode.position.y + 20) * zoom; // Scaled y-coordinate of source node center
  const targetX = (targetNode.position.x + 60) * zoom; // Scaled x-coordinate of target node center
  const targetY = (targetNode.position.y + 20) * zoom; // Scaled y-coordinate of target node center

  // Calculate dx and dy using scaled coordinates
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  // Control distance affects curve shape relative to line length, calculate based on scaled distance
  const controlDistance = distance * 0.1; // Reduced curve intensity for subtlety

  // Calculate perpendicular offset for control points based on scaled dx and dy
  const offsetX = distance === 0 ? 0 : -dy / distance * controlDistance;
  const offsetY = distance === 0 ? 0 : dx / distance * controlDistance;

  // Create two control points for a subtle curve, relative to scaled source/target points
  const control1X = sourceX + dx * 0.5 + offsetX;
  const control1Y = sourceY + dy * 0.5 + offsetY;
  const control2X = sourceX + dx * 0.5 - offsetX;
  const control2Y = sourceY + dy * 0.5 - offsetY;

  // Create the path for the curved line using cubic bezier with scaled coordinates
  const path = `M ${sourceX} ${sourceY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${targetX} ${targetY}`;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{
        // Remove scale transform from SVG, path coordinates are already scaled
        // transform: `scale(${zoom})`,
        // transformOrigin: 'top left',
        overflow: 'visible'
      }}
    >
      {/* Main connection line */}
      <path
        d={path}
        // Apply stroke color and other styles directly
        stroke="currentColor" // Default stroke color (will be overridden by CSS)
        strokeWidth="3" // Fixed stroke width - scales with path coordinates
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-primary/80 dark:stroke-gray-400 drop-shadow-sm dark:drop-shadow-[0_2px_4px_rgba(255,255,255,0.3)]" // Use Tailwind classes for theme-based color and shadow
      />
    </svg>
  )
} 