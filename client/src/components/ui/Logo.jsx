import React, { useState } from "react";
import logoImg from "../../assets/Sathi_Meet_Logo.png";

const Logo = ({ light = false, className = "" }) => {
  const [imgSrc, setImgSrc] = useState(logoImg);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (imgSrc === logoImg) {
      setImgSrc("/Sathi_Meet_Logo.png");
    } else if (imgSrc === "/Sathi_Meet_Logo.png") {
      setImgSrc("/sathi_meet_logo.png");
    } else if (imgSrc === "/sathi_meet_logo.png") {
      setImgSrc("/images/Sathi_Meet_Logo.png");
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div className={`flex items-center gap-2 cursor-pointer font-black text-xl tracking-tight select-none ${className}`}>
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-violet-600 text-white shadow-md shadow-pink-500/30 text-lg">
          🔥
        </span>
        <span className={light ? "text-white" : "text-slate-900"}>
          Sathi<span className="text-pink-600">Meet</span>
        </span>
      </div>
    );
  }

  return (
    <div
      className={`group flex items-center gap-2.5 cursor-pointer select-none transition-transform duration-300 hover:scale-[1.03] ${className}`}
    >
      <img
        src={imgSrc}
        alt="Sathi Meet Logo"
        onError={handleError}
        className={`
          h-12 sm:h-14 md:h-16
          w-auto
          max-w-[550px] sm:max-w-[590px] md:max-w-[700px] 
          object-contain
          transition-all duration-300
          ${
            light
              ? "brightness-110 drop-shadow-[0_0_16px_rgba(236,72,153,0.4)] filter"
              : "drop-shadow-[0_2px_8px_rgba(236,72,153,0.15)]"
          }
        `}
      />
    </div>
  );
};

export default Logo;