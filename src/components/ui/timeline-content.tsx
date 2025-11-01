import { motion, useScroll, useTransform } from "framer-motion";
import React, { ReactNode, useRef } from "react";

interface TimelineContentProps {
  as?: keyof JSX.IntrinsicElements;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement>;
  customVariants?: {
    visible: (i?: number) => { y: number; opacity: number; filter: string; transition: any };
    hidden: { filter: string; y: number; opacity: number };
  };
  children: ReactNode;
  className?: string;
}

export const TimelineContent: React.FC<TimelineContentProps> = ({
  as: Component = "div",
  animationNum = 0,
  timelineRef,
  customVariants,
  children,
  className = "",
}) => {
  const ref = useRef<HTMLElement>(null);
  const targetRef = timelineRef || ref;

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.8", "start 0.3"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [20, 0, 0]);
  const filter = useTransform(scrollYProgress, [0, 0.5, 1], ["blur(10px)", "blur(0px)", "blur(0px)"]);

  const variants = customVariants || {
    visible: (i: number = 0) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: 20,
      opacity: 0,
    },
  };

  return (
    <motion.div
      ref={ref as any}
      style={{
        opacity,
        y,
        filter,
      }}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={className}
      as={Component as any}
    >
      {children}
    </motion.div>
  );
};

