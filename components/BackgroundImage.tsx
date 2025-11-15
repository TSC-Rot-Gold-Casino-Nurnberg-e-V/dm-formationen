"use client";

import Image from "next/image";
import backgroundImage from "../public/background-image.jpg";
import { useEffect, useRef } from "react";
import { isMobileSafari, isSafari } from "react-device-detect";

export const BackgroundImage = () => {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    function handleScroll() {
      if (imageRef.current) {
        const scroll = window.scrollY;
        imageRef.current.style.transform = `translateY(${scroll * 0.6}px)`;
      }
    }
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="absolute -z-10 opacity-80 inset-x-0 top-0 max-lg:h-[60rem] lg:bottom-0">
      <Image
        ref={imageRef}
        src={backgroundImage}
        alt=""
        className={
          "object-cover object-top opacity-80 blur-[2px] " +
          (isSafari || isMobileSafari ? "will-change-transform" : "")
        }
        fill
        priority
        suppressHydrationWarning
      />
    </div>
  );
};
