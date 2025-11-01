import { motion, useSpring, useMotionValueEvent } from "framer-motion";
import React, { useEffect, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  className?: string;
  format?: (value: number) => string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  className = "",
  format = (val) => Math.round(val).toString(),
}) => {
  const [display, setDisplay] = useState(format(value));
  const spring = useSpring(0, {
    stiffness: 100,
    damping: 30,
  });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useMotionValueEvent(spring, "change", (latest) => {
    setDisplay(format(latest));
  });

  return (
    <motion.span className={className}>
      {display}
    </motion.span>
  );
};

