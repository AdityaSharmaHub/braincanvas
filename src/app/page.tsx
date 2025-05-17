import { Button } from "@/components/ui/button";
import { PenToolIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-background flex flex-col gap-12 min-h-screen items-center justify-center">
      <h1 className="relative text-foreground text-7xl font-bold">
        <span className="text-primary">Brain</span>
        <span className="italic">Canvas</span>
        <PenToolIcon className="absolute right-0 top-0" />
      </h1>
      <Button className="text-primary-foreground">
        This is a button
      </Button>
    </div>
  );
}