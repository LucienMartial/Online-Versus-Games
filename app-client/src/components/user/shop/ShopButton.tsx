import { ReactNode } from "react";

interface ShopButtonProps {
  onClick?: () => void;
  feature: "buy" | "select" | "preview";
  grayedOut?: boolean;
  children?: ReactNode;
  className?: string;
}

function ShopButton({
  onClick,
  feature,
  grayedOut = false,
  children,
  className,
}: ShopButtonProps) {
  function buttonStyle() {
    switch (feature) {
      case "buy":
        return "bg-lime-800 hover:bg-lime-900 ";
      case "select":
        return "bg-blue-800 hover:bg-blue-900 ";
      case "preview":
        return "bg-purple-800 hover:bg-purple-900 ";
    }
  }

  return (
    <button
      onClick={onClick}
      className={
        `${
          !grayedOut
            ? `${buttonStyle()} text-white font-bold py-2.5 px-5 rounded hover:drop-shadow-2xl hover:shadow-inner w-full `
            : `bg-gray-500 text-white font-bold py-2.5 px-5 rounded hover:drop-shadow-2xl hover:shadow-inner w-full `
        }` + className
      }
      disabled={grayedOut}
    >
      {children}
    </button>
  );
}

export { ShopButton };
