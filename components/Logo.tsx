import React from 'react';
import logoImg from '../public/images/minha-logo.png';

interface LogoProps {
  tone?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ tone, className }) => {
  return (
    <img 
      src={logoImg.src} 
      alt="Otrebol" 
      className={className || "h-10 w-auto"} 
    />
  );
};

export default Logo;