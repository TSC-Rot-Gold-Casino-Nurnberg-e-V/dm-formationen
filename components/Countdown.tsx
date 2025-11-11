"use client";

import { useEffect, useState } from "react";

const eventDate = new Date("2026-11-07T12:30:00Z");

export const Countdown = () => {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const total = eventDate.getTime() - currentTime.getTime();
  const seconds = Math.max(0, Math.floor((total / 1000) % 60));
  const minutes = Math.max(0, Math.floor((total / 1000 / 60) % 60));
  const hours = Math.max(0, Math.floor((total / (1000 * 60 * 60)) % 24));
  const days = Math.max(0, Math.floor(total / (1000 * 60 * 60 * 24)));

  return (
    <div className="bg-base-800 pb-6 pt-4" suppressHydrationWarning={true}>
      <section className="container px-2 w-fit">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Countdown bis zum Event
        </h2>
        <div className="gap-2 sm:gap-3 grid grid-cols-4 text-center">
          <div className=" bg-base-700 rounded-lg py-2 sm:py-3 px-2 sm:px-4">
            <div className="text-2xl sm:text-4xl text-base-50 font-bold">
              {days}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-base-300 tracking-wide">
              TAGE
            </div>
          </div>
          <div className=" bg-base-700 rounded-lg py-2 sm:py-3 px-2 sm:px-4">
            <div className="text-2xl sm:text-4xl text-base-50 font-bold">
              {hours}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-base-300 tracking-wide">
              STUNDEN
            </div>
          </div>
          <div className=" bg-base-700 rounded-lg py-2 sm:py-3 px-2 sm:px-4">
            <div className="text-2xl sm:text-4xl text-base-50 font-bold">
              {minutes}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-base-300 tracking-wide">
              MINUTEN
            </div>
          </div>
          <div className=" bg-base-700 rounded-lg py-2 sm:py-3 px-2 sm:px-4">
            <div className="text-2xl sm:text-4xl text-base-50 font-bold">
              {seconds}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-base-300 tracking-wide">
              SEKUNDEN
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
