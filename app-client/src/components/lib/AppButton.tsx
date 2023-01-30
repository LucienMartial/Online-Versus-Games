import { ReactNode } from "react";

interface AppButtonProps {
  onClick?: () => void;
  color: "regular" | "danger";
  type?: "submit" | "button";
  children?: ReactNode;
  className?: string;
  grayedOut?: boolean;
}

export default function AppButton({
  onClick,
  color,
  type,
  children,
  className,
  grayedOut,
}: AppButtonProps) {
  function buttonStyle() {
    switch (color) {
      case "danger":
        return "bg-red-800 hover:bg-red-900";
      case "regular":
        return "bg-blue-800 hover:bg-blue-900";
    }
  }

  function handleClick() {
    if (!onClick) return;
    if (color !== "danger" || confirm("Are you sure?")) {
      onClick();
    }
  }

  return (
    <button
      onClick={handleClick}
      type={type}
      className={
        `${
          !grayedOut
            ? `${buttonStyle()} text-white font-bold py-2.5 px-5 rounded w-fit `
            : `bg-gray-500 text-white font-bold py-2.5 px-5 rounded w-fit `
        }` + className
      }
      disabled={grayedOut}
    >
      {children}
    </button>
  );
}
