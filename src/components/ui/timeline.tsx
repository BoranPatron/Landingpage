import {
  useTransform,
  useScroll,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { TimelineEntry, Role } from "../../timeline-entry";
import { TimelineTabs } from "./timeline-tabs";
import { bautraegerTimelineData, dienstleisterTimelineData } from "../../timeline-data";

export const Timeline: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [activeRole, setActiveRole] = useState<Role>("bauträger");

  const data =
    activeRole === "bauträger"
      ? bautraegerTimelineData
      : dienstleisterTimelineData;

  useEffect(() => {
    const updateHeight = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setHeight(rect.height);
      }
    };
    
    updateHeight();
    
    // Update height when window resizes or role changes
    window.addEventListener('resize', updateHeight);
    const timer = setTimeout(updateHeight, 100); // Small delay to ensure DOM is updated
    
    return () => {
      window.removeEventListener('resize', updateHeight);
      clearTimeout(timer);
    };
  }, [activeRole, data]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-transparent font-sans md:px-10 overflow-x-hidden"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-24 md:py-32 px-2 md:px-8 lg:px-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-3 text-white dark:text-white mx-auto font-bold">
            So funktioniert BuildWise
          </h2>
          <p className="text-neutral-300 dark:text-neutral-300 text-base md:text-lg max-w-3xl mx-auto mb-6 md:mb-8">
            Entdecken Sie, wie BuildWise die Bauwirtschaft revolutioniert – 
            speziell zugeschnitten auf Ihre Rolle.
          </p>
        </div>
        <div className="flex justify-center">
          <TimelineTabs activeRole={activeRole} onRoleChange={setActiveRole} />
        </div>
      </div>
      <div ref={ref} className="relative max-w-7xl mx-auto -mx-2 md:mx-auto pb-32 overflow-x-hidden">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-12 md:pt-60 md:gap-16"
          >
            <div className="md:sticky relative flex flex-col md:flex-row z-0 items-center md:top-40 self-start w-20 flex-shrink-0 md:max-w-sm lg:max-w-md md:w-full">
              <div className="h-14 w-14 md:h-16 md:w-16 absolute left-0 md:left-4 rounded-full bg-gradient-to-br from-[#51646f]/40 to-[#41535c]/40 backdrop-blur-xl border-2 border-[#f9c74f]/50 flex items-center justify-center shadow-[0_0_32px_rgba(249,199,79,0.3)]">
                <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-gradient-to-br from-[#f9c74f] to-[#d4af3a] border-2 border-[#f9c74f] shadow-[0_0_20px_rgba(249,199,79,0.5)]" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-24 md:text-2xl lg:text-3xl font-semibold text-white dark:text-white leading-tight">
                {item.title}
              </h3>
            </div>
            <div className="relative pl-0 ml-20 md:ml-0 md:pl-8 pr-0 md:pr-4 w-full max-w-full overflow-hidden z-10">
              <h3 className="md:hidden block text-xl md:text-2xl lg:text-3xl mb-4 md:mb-6 text-left font-semibold text-white dark:text-white">
                {item.title}
              </h3>
              <div className="text-base md:text-lg break-words overflow-wrap-anywhere">
                {item.content}
              </div>
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute left-[7px] md:left-12 top-0 overflow-visible w-[3px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-600 dark:via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] z-[1]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[3px] bg-gradient-to-t from-[#f9c74f] via-[#f9c74f]/70 to-transparent from-[0%] via-[10%] rounded-full shadow-[0_0_24px_rgba(249,199,79,0.8)] z-[1]"
          />
        </div>
      </div>
    </div>
  );
};

