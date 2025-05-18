import { TopBar } from "@/components/layout/top-bar"
import { Sidebar } from "@/components/layout/sidebar"
import { MindMapCanvas } from "@/components/canvas/mind-map-canvas"

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <TopBar />
      <Sidebar />
      <MindMapCanvas />
    </main>
  )
}