import { useEffect, useState } from "react";

const Bar = ({ barWidth }: { barWidth: number }) => {
  const [displayedWidth, setDisplayedWidth] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const animateWidth = () => {
      setDisplayedWidth((prev) => {
        if (prev < barWidth) {
          return prev + 1;
        } else {
          cancelAnimationFrame(animationFrameId);
          return prev;
        }
      });
      animationFrameId = requestAnimationFrame(animateWidth);
    };

    animateWidth();

    return () => cancelAnimationFrame(animationFrameId);
  }, [barWidth]);

  return (
    <div
      id="bar-container"
      className="w-full h-1 overflow-hidden rounded-full bg-[#EEEEEE] flex justify-start"
    >
      <div
        id="bar"
        className="bg-[#FFB200] rounded-full h-full transition-all duration-300"
        style={{ width: `${displayedWidth}%` }}
      ></div>
    </div>
  );
};

export default Bar;
