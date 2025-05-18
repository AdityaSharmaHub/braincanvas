"use client"

import { useState } from "react"
import { 
  Plus, 
  Type, 
  Image, 
  Link, 
  Palette, 
  ZoomIn, 
  ZoomOut, 
  Maximize,
  ChevronRight,
  ChevronLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import useMindMapStore from "@/store/mind-map-store"

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { zoomIn, zoomOut, resetView } = useMindMapStore()

  return (
    <>
      {/* Desktop Sidebar */}
      <div 
        className={`fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-2 transition-all duration-200 ${
          isExpanded ? "w-48" : "w-12"
        }`}
      >
        <div className="bg-background/80 backdrop-blur-sm border rounded-lg shadow-lg p-2 flex flex-col gap-2">
          {/* Node Creation Tools */}
          <div className="flex flex-col gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-full justify-start items-center gap-2">
                  <Plus className="h-4 w-4 ml-1.5" />
                  {isExpanded && <span>Add Node</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Add Node</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-full justify-start gap-2">
                  <Type className="h-4 w-4 ml-1.5" />
                  {isExpanded && <span>Text</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Add Text</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-full justify-start gap-2">
                  <Image className="h-4 w-4 ml-1.5" />
                  {isExpanded && <span>Image</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Add Image</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-full justify-start gap-2">
                  <Link className="h-4 w-4 ml-1.5" />
                  {isExpanded && <span>Link</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Add Link</TooltipContent>
            </Tooltip>
          </div>

          <div className="h-[1px] bg-border my-1" />

          {/* Style Tools */}
          <div className="flex flex-col gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-full justify-start gap-2">
                  <Palette className="h-4 w-4 ml-1.5" />
                  {isExpanded && <span>Style</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Style</TooltipContent>
            </Tooltip>
          </div>

          <div className="h-[1px] bg-border my-1" />

          {/* View Controls */}
          <div className="flex flex-col gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-full justify-start gap-2"
                  onClick={zoomIn}
                >
                  <ZoomIn className="h-4 w-4 ml-1.5" />
                  {isExpanded && <span>Zoom In</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Zoom In</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-full justify-start gap-2"
                  onClick={zoomOut}
                >
                  <ZoomOut className="h-4 w-4 ml-1.5" />
                  {isExpanded && <span>Zoom Out</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Zoom Out</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-full justify-start gap-2"
                  onClick={resetView}
                >
                  <Maximize className="h-4 w-4 ml-1.5" />
                  {isExpanded && <span>Reset View</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Reset View</TooltipContent>
            </Tooltip>
          </div>

          {/* Expand/Collapse Button */}
          <Button
            variant="ghost"
            size="icon"
            className="w-full justify-start gap-2 mt-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronLeft className="h-4 w-4 ml-1.5" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-1.5" />
            )}
            {isExpanded && <span>Collapse</span>}
          </Button>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <div className="bg-background/80 backdrop-blur-sm border rounded-full shadow-lg p-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Type className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Image className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Link className="h-4 w-4" />
            </Button>
            <div className="h-8 w-[1px] bg-border" />
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={zoomIn}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={zoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
} 