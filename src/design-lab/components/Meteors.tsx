import { useEffect, useState } from "react";
import { cn } from "../lib/cn";

type MeteorsProps = { number?: number; className?: string };

type MeteorStyle = {
  top: string;
  left: string;
  animationDelay: string;
  animationDuration: string;
};

/** Aceternity Meteors — позиции считаются только на клиенте, чтобы не было SSR-mismatch. */
export function Meteors({ number = 20, className }: MeteorsProps) {
  const [styles, setStyles] = useState<MeteorStyle[]>([]);

  useEffect(() => {
    setStyles(
      Array.from({ length: number }).map(() => ({
        top: "-2px",
        left: `${Math.floor(Math.random() * 100)}%`,
        animationDelay: `${(Math.random() * 0.6).toFixed(2)}s`,
        animationDuration: `${(Math.random() * 8 + 4).toFixed(2)}s`,
      })),
    );
  }, [number]);

  return (
    <>
      {styles.map((s, i) => (
        <span
          key={i}
          className={cn(
            "pointer-events-none absolute left-1/2 top-1/2 h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-[9999px] bg-yellow-200 shadow-[0_0_0_1px_#ffffff10]",
            "before:absolute before:top-1/2 before:h-px before:w-[60px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-[#FFF200] before:to-transparent before:content-['']",
            className,
          )}
          style={s}
        />
      ))}
    </>
  );
}
