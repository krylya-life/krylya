import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";

type MagicCardProps = {
  children?: ReactNode;
  className?: string;
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
  /** Если указан href — компонент рендерится как <a>, иначе как <div>. */
  href?: string;
  target?: string;
  rel?: string;
};

/** Aceternity-style 3D-tilt card with cursor-following gradient highlight. */
export function MagicCard({
  children,
  className,
  gradientSize = 220,
  gradientColor = "#FFF200",
  gradientOpacity = 0.18,
  href,
  target,
  rel,
}: MagicCardProps) {
  const ref = useRef<HTMLDivElement & HTMLAnchorElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: -gradientSize, y: -gradientSize });
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const onMove = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPos({ x, y });
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const ry = ((x - cx) / cx) * 4;
      const rx = -((y - cy) / cy) * 4;
      setTilt({ rx, ry });
    };
    const onLeave = () => {
      setPos({ x: -gradientSize, y: -gradientSize });
      setTilt({ rx: 0, ry: 0 });
    };
    node.addEventListener("mousemove", onMove);
    node.addEventListener("mouseleave", onLeave);
    return () => {
      node.removeEventListener("mousemove", onMove);
      node.removeEventListener("mouseleave", onLeave);
    };
  }, [gradientSize]);

  const wrapperClass = cn(
    "group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-transform duration-200 ease-out",
    href && "no-underline",
    className,
  );
  const wrapperStyle = {
    transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
  };
  const inner = (
    <>
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(${gradientSize}px circle at ${pos.x}px ${pos.y}px, ${gradientColor}${Math.round(
            gradientOpacity * 255,
          )
            .toString(16)
            .padStart(2, "0")}, transparent 60%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </>
  );

  if (href) {
    return (
      <a ref={ref} href={href} target={target} rel={rel} className={wrapperClass} style={wrapperStyle}>
        {inner}
      </a>
    );
  }

  return (
    <div ref={ref} className={wrapperClass} style={wrapperStyle}>
      {inner}
    </div>
  );
}
