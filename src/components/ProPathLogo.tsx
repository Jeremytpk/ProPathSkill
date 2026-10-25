import React from "react";
import logoImg from "../../assets/ProPathLogo-web.jpg";



interface ProPathLogoProps {
  className?: string;
  size?: number | string;
}

export const ProPathLogo: React.FC<ProPathLogoProps> = ({ className = "", size }) => {
  return (
    <img
      src={logoImg}
      alt="ProPath Logo"
      className={`${className} object-contain`}
      style={size ? { width: size, height: size } : undefined}
      referrerPolicy="no-referrer"
    />
  );
};

