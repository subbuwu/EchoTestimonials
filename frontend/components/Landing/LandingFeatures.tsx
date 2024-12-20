import React from "react";
import { cn } from "@/lib/utils";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";

const LandingFeatures = () => {
  const features = [
    {
      title: "Easy for everyone",
      description:
        "So simple, even your grandma could collect reviews (no offense, grandma).",
      icon: <IconEaseInOut />,
    },
    {
      title: "100% Free",
      description:
        "Yep, you read that right. It's free. No tricks, no hidden fees, no selling your soul.",
      icon: <IconCurrencyDollar />,
    },
    {
      title: "Always working",
      description: "Like your favorite 24/7 diner, but for reviews. Always open!",
      icon: <IconCloud />,
    },
    {
      title: "Share the love",
      description: "One account, many users. Because sharing is caring.",
      icon: <IconRouteAltLeft />,
    },
    {
      title: "Help when you need it",
      description:
        "Our support team is always here. Well, our chatbot is. Same thing, right?",
      icon: <IconHelp />,
    },
    {
      title: "Make it yours",
      description:
        "Customize everything. Make your reviews page as unique as your fingerprint.",
      icon: <IconAdjustmentsBolt />,
    },
    {
      title: "Safe and sound",
      description: "We guard your data like a dragon guards its gold. Rawr!",
      icon: <IconTerminal2 />,
    },
    {
      title: "And much more!",
      description: "Honestly, we're still figuring out what else. But it'll be great!",
      icon: <IconHeart />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 pt-0 lg:py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l border-neutral-800",
        index < 4 && "lg:border-b border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block  text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};

export default LandingFeatures;