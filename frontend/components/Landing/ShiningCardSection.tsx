import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import PulsatingButton from "../ui/pulsating-button";

export function ShiningCardSection() {
  return (
    <NeonGradientCard className="max-w-5xl my-40 mx-auto items-center justify-center text-center">
      <span className="pointer-events-none z-10 h-full whitespace-pre-wrap bg-gradient-to-br from-[#29b4ff] from-35% to-[#00FFF1] bg-clip-text text-center text-5xl font-bold leading-none tracking-tighter text-transparent drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
      Ready to launch?
      Start building with EchoTestimonials
      </span>
      <PulsatingButton className="mx-auto mt-8">Get Started</PulsatingButton>
    </NeonGradientCard>
  );
}
