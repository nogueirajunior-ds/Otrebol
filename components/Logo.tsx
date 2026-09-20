import React from 'react';

interface LogoProps {
  tone?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ tone, className }) => {
  return (
    <img 
      src="/images/minha-logo.png" 
      alt="Otrebol" 
      className={className || "h-10 w-auto"} 
    />
  );
};

export default Logo;