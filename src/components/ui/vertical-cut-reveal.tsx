import { motion } from "framer-motion";
import React, { ReactNode } from "react";

interface VerticalCutRevealProps {
  children: ReactNode;
  splitBy?: "words" | "chars";
  staggerDuration?: number;
  staggerFrom?: "first" | "last";
  reverse?: boolean;
  containerClassName?: string;
  transition?: {
    type?: string;
    stiffness?: number;
    damping?: number;
    delay?: number;
  };
}

export const VerticalCutReveal: React.FC<VerticalCutRevealProps> = ({
  children,
  splitBy = "words",
  staggerDuration = 0.1,
  staggerFrom = "first",
  reverse = false,
  containerClassName = "",
  transition = {
    type: "spring",
    stiffness: 250,
    damping: 40,
    delay: 0,
  },
}) => {
  const text = typeof children === "string" ? children : String(children);
  
  const splitText = splitBy === "words" 
    ? text.split(/\s+/)
    : text.split("");

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: staggerDuration,
        staggerDirection: reverse ? -1 : 1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      clipPath: "inset(100% 0 0 0)",
      opacity: 0,
    },
    visible: {
      clipPath: "inset(0% 0 0 0)",
      opacity: 1,
      transition: {
        ...transition,
        clipPath: {
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    },
  };

  return (
    <motion.span
      className={`inline-block ${containerClassName}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {splitText.map((word, index) => (
        <motion.span
          key={index}
          variants={itemVariants}
          style={{ display: "inline-block" }}
          className={splitBy === "words" && index < splitText.length - 1 ? "mr-1" : ""}
        >
          {word}
          {splitBy === "words" && index < splitText.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );
};

