"use client";

import React, { useState, useEffect, useRef } from "react";

// Minute-based clock component to avoid re-rendering the entire desktop each second
const TimeDisplay: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const instant = new Date();
    const msUntilNextMinute =
      60000 - (instant.getSeconds() * 1000 + instant.getMilliseconds());
    const timeoutId = setTimeout(() => {
      setNow(new Date());
      intervalRef.current = setInterval(() => setNow(new Date()), 60000);
    }, msUntilNextMinute);
    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const date = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <span className="time">{time}</span>
      <span className="date">{date}</span>
    </>
  );
};

export default TimeDisplay;
