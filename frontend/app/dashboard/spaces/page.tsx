"use client";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SpacesGrid } from "@/components/Dashboard/SpacesGrid";
import UserMenu from "@/components/UserMenu";
import { Card, CardContent } from "@/components/ui/card";
import { PageTransition, StaggerItem } from "@/components/PageTransition";
import { LineChart, Users, Star, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { icon: Users, label: "Total Users", value: "1,234", trend: "+12%" },
    { icon: Star, label: "Active Spaces", value: "45", trend: "+5%" },
    { icon: LineChart, label: "Views", value: "23.4K", trend: "+28%" },
    { icon: TrendingUp, label: "Conversion", value: "3.2%", trend: "+2%" }
  ];

  const animateOptions =  {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { 
      duration: 0.4,
      type: "spring",
      stiffness: 260,
      damping: 20 
    }
  };

  return (
    <PageTransition options={animateOptions}>
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 flex flex-col overflow-hidden bg-[#171717]">
        <ScrollArea className="flex-1 p-4 lg:p-6">
          {/* Header */}
          <StaggerItem>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h2 className="text-3xl font-medium">Good to see you!</h2>
              <p className="text-zinc-400 mt-1">Here's what's happening with your spaces</p>
            </div>
            <div className="mt-4 sm:mt-0 xl:flex hidden">
              <UserMenu />
            </div>
          </div>
          </StaggerItem>
          {/* Stats Grid */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <stat.icon className="h-8 w-8 text-blue-500 mb-4" />
                      <p className="text-sm text-zinc-400">{stat.label}</p>
                      <div className="flex items-baseline mt-1">
                        <p className="text-2xl font-semibold">{stat.value}</p>
                        <span className="ml-2 text-sm text-green-500">{stat.trend}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div> */}

          {/* Spaces Grid */}

          <SpacesGrid />
        </ScrollArea>
      </div>
    </div>
    </PageTransition>
  );
}