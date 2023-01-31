import { ReactNode } from "react";

interface ShopButtonProps {
  onClick?: () => void;
  feature: "buy" | "select";
  children?: ReactNode;
  className?: string;
}

function ShopButton({
  onClick,
  feature,
  children,
  className,
}: ShopButtonProps) {
  function buttonStyle() {
    switch (feature) {
      case "buy":
        return "bg-lime-800 hover:bg-lime-900 ";
      case "select":
        return "bg-blue-800 hover:bg-blue-900 ";
    }
  }

  return (
    <button
      onClick={onClick}
      className={`
        ${buttonStyle()} text-white font-bold py-2.5 px-5 rounded hover:drop-shadow-2xl hover:shadow-inner w-full ${
        className ? className : ""
      }`}
    >
      {children}
    </button>
  );
}

export { ShopButton };
