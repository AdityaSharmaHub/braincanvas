"use client"

import { Save, Undo, Redo, Download, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"

export function TopBar() {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm border rounded-full shadow-lg">
      <Input
        type="text"
        placeholder="Untitled Mind Map"
        className="w-[100px] sm:w-[300px] border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <div className="h-4 w-[1px] bg-border" />
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Save className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <div className="h-4 w-[1px] bg-border" />
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Export as PNG
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
} 