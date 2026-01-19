"use client";

import React from "react";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export default function LearnMoreButton({ className, children }: Props) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const id = "learn-more";
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Update the hash without causing a navigation
      history.replaceState(null, "", `#${id}`);
    } else {
      // Fallback: set the hash which will navigate if on a different route
      window.location.hash = `#${id}`;
    }
  };

  return (
    <a href="#learn-more" onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
