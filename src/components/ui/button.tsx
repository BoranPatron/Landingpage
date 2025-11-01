import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded";
  
  const variantClasses = {
    default: "bg-white text-black border-2 border-white hover:bg-white/90",
    outline: "bg-transparent text-white/80 border-2 border-white/20 hover:bg-white/10 hover:text-white hover:border-white/30",
    ghost: "bg-transparent text-white/80 hover:bg-white/10 hover:text-white"
  };
  
  const sizeClasses = {
    sm: "h-6 px-2 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base"
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

