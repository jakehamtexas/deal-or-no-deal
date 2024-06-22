"use client";
import { useState } from "react";

export type BriefcaseProps = {
  key: string;
  position: number;
  hiddenImg: string;
};
export function Briefcase({ position, hiddenImg }: BriefcaseProps) {
  const [isHidden, setIsHidden] = useState(true);
  const src = isHidden ? "/briefcase.png" : hiddenImg;
  const onClick = () => {
    console.log("Clicked on briefcase");

    // Toggle the hidden image
    setIsHidden(!isHidden);
  };

  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center justify-center w-24 h-24"
    >
      {
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={`Briefcase ${position}`} />
      }
      <span>{position}</span>
    </div>
  );
}
