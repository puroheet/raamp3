import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-raisin-black/50 rounded-2xl p-8 border border-ghost-white/10 shadow-lg ${className}`}>
      {children}
    </div>
  );
}
