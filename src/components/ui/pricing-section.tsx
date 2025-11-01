"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-content";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import { CheckCheck, CreditCard, HandshakeIcon } from "lucide-react";
import { useRef } from "react";

const pricingCategories = [
  {
    name: "Bauträger",
    category: "bautraeger" as const,
    description: "Credit-System, nur zahlen wenn genutzt",
    price: "Ab 0 CHF",
    priceDetail: "Credit-System",
    buttonText: "Jetzt starten",
    accentColor: "orange",
    icon: <CreditCard className="w-full h-full" />,
    includes: [
      "Für Bauträger inklusive:",
      "300 Credits gratis zum Start",
      "Alle Pro-Features inklusive",
      "Credits durch Aktivität verlängerbar",
      "Flexibles Credit-System",
      "Nur zahlen bei Nutzung",
    ],
  },
  {
    name: "Dienstleister",
    category: "dienstleister" as const,
    description: "Provision nur bei Auftragserfolg",
    price: "2.7-4.7%",
    priceDetail: "Provision bei Erfolg",
    buttonText: "Jetzt registrieren",
    accentColor: "blue",
    icon: <HandshakeIcon className="w-full h-full" />,
    includes: [
      "Für Dienstleister inklusive:",
      "Keine Gebühren für Plattformnutzung",
      "Gezielte Projektanfragen",
      "Ranking-basierte Kosten",
      "Nur zahlen bei Erfolg",
      "Transparente Provision",
    ],
  },
];


export default function PricingSection5() {
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  return (
    <div
      className="px-4 sm:px-6 pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-16 md:pb-20 max-w-7xl mx-auto relative"
      ref={pricingRef}
    >
      <article className="text-center mb-8 sm:mb-10 md:mb-12 space-y-3 sm:space-y-4 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl capitalize font-bold text-gray-900 mb-4 md:mb-6">
          <VerticalCutReveal
            splitBy="words"
            staggerDuration={0.15}
            staggerFrom="first"
            reverse={true}
            containerClassName="justify-center"
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 40,
              delay: 0,
            }}
          >
            Transparent & fair
          </VerticalCutReveal>
        </h2>

        <TimelineContent
          as="p"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="text-base md:text-lg text-gray-600 px-2 sm:px-0 mb-12 md:mb-16"
        >
          Keine versteckten Kosten. Erst zahlen bei Erfolg.
        </TimelineContent>
      </article>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto py-4 sm:py-6">
        {pricingCategories.map((category, index) => {
          const isBautraeger = category.category === "bautraeger";
          const accentColorClass = isBautraeger 
            ? "orange" 
            : "blue";

          return (
            <TimelineContent
              key={category.category}
              as="div"
              animationNum={1 + index}
              timelineRef={pricingRef}
              customVariants={revealVariants}
            >
              <Card
                className={cn(
                  "relative border transition-all duration-300 hover:scale-[1.01] h-full flex flex-col",
                  isBautraeger
                    ? "ring-1 ring-[#f9c74f]/20 bg-gradient-to-br from-[#f9c74f]/5 to-transparent backdrop-blur-lg border-[#f9c74f]/20 shadow-[0_0_8px_rgba(249,199,79,0.1)] hover:shadow-[0_0_12px_rgba(249,199,79,0.15)]"
                    : "ring-1 ring-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent backdrop-blur-lg border-blue-500/20 shadow-[0_0_8px_rgba(59,130,246,0.1)] hover:shadow-[0_0_12px_rgba(59,130,246,0.15)]",
                )}
              >
                <CardHeader className="text-left">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={cn(
                        "p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl backdrop-blur-sm flex-shrink-0",
                        isBautraeger
                          ? "bg-[#f9c74f]/10 border border-[#f9c74f]/20 text-[#f9c74f]"
                          : "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                      )}>
                        <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6 flex items-center justify-center">
                          {category.icon}
                        </div>
                      </div>
                      <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                    {category.description}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className={cn(
                      "text-3xl sm:text-4xl md:text-5xl font-bold",
                      isBautraeger ? "text-[#f9c74f]" : "text-blue-500"
                    )}>
                      {category.price}
                    </span>
                    <span className="text-sm sm:text-base md:text-lg text-gray-600">
                      {category.priceDetail}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 flex-1 flex flex-col">
                  <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-neutral-200/50 flex-1">
                    <h4 className="font-medium text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">
                      {category.includes[0]}
                    </h4>
                    <ul className="space-y-1.5 sm:space-y-2 font-medium">
                      {category.includes.slice(1).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2 sm:gap-3">
                          <span className={cn(
                            "h-5 w-5 sm:h-6 sm:w-6 bg-white/10 border rounded-full grid place-content-center mt-0.5 flex-shrink-0 backdrop-blur-sm",
                            isBautraeger
                              ? "border-[#f9c74f]/30"
                              : "border-blue-500/30"
                          )}>
                            <CheckCheck className={cn(
                              "h-3 w-3 sm:h-4 sm:w-4",
                              isBautraeger ? "text-[#f9c74f]" : "text-blue-500"
                            )} />
                          </span>
                          <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TimelineContent>
          );
        })}
      </div>
    </div>
  );
}

