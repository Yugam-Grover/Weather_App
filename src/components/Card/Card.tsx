import clsx from "clsx";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  title?: string;
  childrenClassName?: string;
  animate?: boolean;
  delay?: number;
  className?: string;
};

const Card = ({
  children,
  title,
  childrenClassName,
  animate = true,
  delay = 0,
  className,
}: Props) => {
  return (
    <div
      className={clsx(
        "rounded-xl shadow-md p-5 flex flex-col gap-4 bg-[#1e1d2e]",
        className,
      )}>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div
        className={clsx(
          childrenClassName,
          animate && "animate-reveal prepare-reveal",
        )}
        style={animate ? { animationDelay: `${delay}ms` } : {}}>
        {children}
      </div>
    </div>
  );
};

export default Card;
