'use client'

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
 
export function SplineSceneBasic() {
  return (
    <Card className="w-full h-[360px] md:h-[420px] bg-zinc-950/90 border-border/80 relative overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-3xl">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      {/* Left content */}
      <div className="flex-1 p-6 md:p-10 relative z-10 flex flex-col justify-center text-left">
        <h1 className="text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 via-neutral-100 to-neutral-400 leading-tight">
          ChatWiz Fusion
        </h1>
        <p className="mt-4 text-neutral-400 max-w-md text-xs md:text-sm leading-relaxed">
          Experience the next generation of unified AI. Engage in natural conversations with local LLMs, generate artwork, and inspect design tokens dynamically.
        </p>
      </div>

      {/* Right content */}
      <div className="flex-1 relative w-full h-[180px] md:h-full select-none">
        <SplineScene 
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>
    </Card>
  )
}
