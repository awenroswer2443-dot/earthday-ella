"use client";

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number; color?: string };

function mk(
  viewBox: string,
  draw: (props: { fill: string }) => React.ReactNode
) {
  return function Icon({ size = 24, color, ...rest }: IconProps) {
    const fill = color || "currentColor";
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        aria-hidden="true"
        {...rest}
      >
        {draw({ fill })}
      </svg>
    );
  };
}

export const HeartIcon = mk("0 0 32 32", ({ fill }) => (
  <path
    d="M16 28s-11-6.8-11-14.2C5 9.6 8.3 7 11.7 7c2.1 0 4 1 5.3 2.6C18.3 8 20.2 7 22.3 7 25.7 7 29 9.6 29 13.8 29 21.2 18 28 16 28Z"
    fill={fill}
  />
));

export const StarIcon = mk("0 0 32 32", ({ fill }) => (
  <path
    d="M16 3l3.7 7.9 8.6 1.2-6.2 6.1 1.5 8.7L16 22.8 8.4 26.9l1.5-8.7-6.2-6.1 8.6-1.2L16 3Z"
    fill={fill}
  />
));

export const SparkleIcon = mk("0 0 32 32", ({ fill }) => (
  <>
    <path
      d="M16 2c.8 5.8 4.4 9.4 10.2 10.2C20.4 13 16.8 16.6 16 22.4 15.2 16.6 11.6 13 5.8 12.2 11.6 11.4 15.2 7.8 16 2Z"
      fill={fill}
    />
    <path
      d="M25 22c.4 2.9 1.8 4.3 4.7 4.7-2.9.4-4.3 1.8-4.7 4.7-.4-2.9-1.8-4.3-4.7-4.7 2.9-.4 4.3-1.8 4.7-4.7Z"
      fill={fill}
      opacity={0.8}
    />
  </>
));

export const LeafIcon = mk("0 0 32 32", ({ fill }) => (
  <>
    <path
      d="M27 4c-12 0-22 7-22 17 0 3 1 5.5 2.5 7.5L10 26c3-3 7-5 12-6-4 3-7 7-8 12 2 0 5-1 8-3 7-4 10-10 10-17 0-3-1-5.7-5-8Z"
      fill={fill}
    />
    <path
      d="M10 26c4-8 10-13 17-16"
      stroke="rgba(255,255,255,0.7)"
      strokeWidth={1.2}
      strokeLinecap="round"
    />
  </>
));

export const GlobeIcon = mk("0 0 64 64", ({ fill }) => (
  <>
    <circle cx={32} cy={32} r={26} fill="#2f8bbd" />
    {/* Continents */}
    <path
      d="M16 22c3-2 6-3 10-2 2 0 3 2 5 2 3 0 5-2 8-1 2 0 3 2 2 4-2 3-5 3-8 3-2 0-3 2-2 4 1 2 4 2 6 1 2-1 3-3 5-2"
      fill={fill}
    />
    <path
      d="M22 40c2 0 5 1 7 3 3 3 6 4 10 3 2-1 3-3 3-5-1-2-3-2-5-1-2 1-4 0-4-2"
      fill={fill}
    />
    {/* Shine */}
    <ellipse cx={24} cy={18} rx={8} ry={5} fill="#fff" opacity={0.25} />
  </>
));

export const FlowerIcon = mk("0 0 32 32", ({ fill }) => (
  <>
    <circle cx={16} cy={10} r={5} fill={fill} />
    <circle cx={22} cy={14} r={5} fill={fill} />
    <circle cx={22} cy={20} r={5} fill={fill} />
    <circle cx={16} cy={22} r={5} fill={fill} />
    <circle cx={10} cy={20} r={5} fill={fill} />
    <circle cx={10} cy={14} r={5} fill={fill} />
    <circle cx={16} cy={16} r={3.5} fill="#ffd35c" />
  </>
));

export const BudIcon = mk("0 0 32 32", ({ fill }) => (
  <>
    <path
      d="M16 22c-5 0-8-3-8-8 0-4 3-6 8-6s8 2 8 6c0 5-3 8-8 8Z"
      fill={fill}
    />
    <path d="M16 22v8" stroke="#3f9834" strokeWidth={2} strokeLinecap="round" />
    <path
      d="M16 26c-2 0-4-2-5-4 3 0 5 1 5 4Z"
      fill="#3f9834"
    />
    <path
      d="M16 28c2 0 4-1 5-3-3 0-5 1-5 3Z"
      fill="#3f9834"
    />
  </>
));

export const SeedIcon = mk("0 0 32 32", ({ fill }) => (
  <>
    <ellipse cx={16} cy={18} rx={6} ry={8} fill={fill} />
    <path
      d="M16 10c1-2 3-3 5-3-1 2-2 3-5 3Z"
      fill="#3f9834"
    />
  </>
));

export const BeeIcon = mk("0 0 48 40", ({ fill }) => (
  <>
    {/* Wings */}
    <ellipse cx={16} cy={12} rx={8} ry={5} fill="#ffffff" opacity={0.8} />
    <ellipse cx={32} cy={12} rx={8} ry={5} fill="#ffffff" opacity={0.8} />
    {/* Body */}
    <ellipse cx={24} cy={22} rx={12} ry={10} fill={fill} />
    <rect x={16} y={17} width={16} height={3} fill="#3b1e3a" />
    <rect x={14} y={23} width={20} height={3} fill="#3b1e3a" />
    {/* Face */}
    <circle cx={34} cy={20} r={5} fill="#ffbf2e" />
    <circle cx={35} cy={19} r={1} fill="#3b1e3a" />
    <path
      d="M33 22c1 1 2 1 3 0"
      stroke="#3b1e3a"
      strokeWidth={0.8}
      fill="none"
      strokeLinecap="round"
    />
    {/* Crown */}
    <path
      d="M29 10l1.5 3 2-2 1 3 2-2 1.5 3"
      stroke="#ffbf2e"
      strokeWidth={1.5}
      fill="none"
      strokeLinecap="round"
    />
  </>
));

export const MuteIcon = mk("0 0 24 24", ({ fill }) => (
  <path
    d="M4 9h3l5-4v14l-5-4H4V9Zm13.3-1.3l1.4 1.4-2.3 2.3 2.3 2.3-1.4 1.4-2.3-2.3-2.3 2.3-1.4-1.4 2.3-2.3-2.3-2.3 1.4-1.4 2.3 2.3 2.3-2.3Z"
    fill={fill}
  />
));

export const SpeakerIcon = mk("0 0 24 24", ({ fill }) => (
  <>
    <path d="M4 9h3l5-4v14l-5-4H4V9Z" fill={fill} />
    <path
      d="M16 8a6 6 0 0 1 0 8M18.5 5.5a10 10 0 0 1 0 13"
      stroke={fill}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </>
));

export const RecycleIcon = mk("0 0 32 32", ({ fill }) => (
  <path
    d="M12 5l-4 7h3v4h-3l-3-5 3-6h4Zm8 0l4 7h-3v4h3l3-5-3-6h-4Zm-4 20l-5 5v-3h-3c-2 0-3-1-3-3v-3h2v3c0 1 0 1 1 1h3v-3l5 3ZM13 15h6v4h-6v-4Z"
    fill={fill}
  />
));

export const iconByName = (name: string) => {
  switch (name) {
    case "heart":
      return HeartIcon;
    case "star":
      return StarIcon;
    case "sparkle":
      return SparkleIcon;
    case "leaf":
      return LeafIcon;
    case "flower":
      return FlowerIcon;
    case "bud":
      return BudIcon;
    case "seed":
      return SeedIcon;
    case "bee":
      return BeeIcon;
    case "globe":
      return GlobeIcon;
    case "recycle":
      return RecycleIcon;
    default:
      return SparkleIcon;
  }
};
