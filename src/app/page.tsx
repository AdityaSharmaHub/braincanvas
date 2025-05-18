import { TopBar } from "@/components/layout/top-bar"
import { Sidebar } from "@/components/layout/sidebar"
import { MindMapCanvas } from "@/components/canvas/mind-map-canvas"
import Footer from "@/components/layout/footer"

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <TopBar />
      <Sidebar />
      <MindMapCanvas />
      <Footer />
    </main>
  )
}