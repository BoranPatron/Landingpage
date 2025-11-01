import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`rounded-lg border border-white/30 bg-white/8 backdrop-blur-lg shadow-xl shadow-white/10 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = "" }) => {
  return (
    <div className={`flex flex-col space-y-1.5 p-4 md:p-5 lg:p-6 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = "" }) => {
  return (
    <h3 className={`text-lg font-semibold leading-none tracking-tight text-white ${className}`}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<CardContentProps> = ({ children, className = "" }) => {
  return (
    <div className={`p-4 md:p-5 lg:p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
};

