import React from 'react';

interface LogoProps {
  tone?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ tone, className }) => {
  return (
    <img 
      src="/images/logonova.png" 
      alt="Otrebol Developments" 
      className={className || "h-24 w-auto object-contain"} 
    />
  );
};

export default Logo;