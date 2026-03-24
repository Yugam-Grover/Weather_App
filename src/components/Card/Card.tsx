import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  title: string;
  childrenClassName?: string;
};

const Card = ({ children, title, childrenClassName }: Props) => {
  return (
    <div className="rounded-xl shadow-md p-5 flex flex-col gap-4 bg-[#1e1d2e]">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className={childrenClassName}>{children}</div>
    </div>
  );
};

export default Card;
