import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AppButtonProps {
  onClick?: () => void;
  color: "regular" | "danger";
  type?: "submit" | "button";
  children?: ReactNode;
  className?: string;
  grayedOut?: boolean;
  href?: string;
}

export default function AppButton({
  onClick,
  color,
  type,
  children,
  className,
  grayedOut = false,
  href: href,
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

  function renderButton(){
    return(<button
      onClick={handleClick}
      type={type}
      className={
        `${
          !grayedOut
            ? `${buttonStyle()} `
            : `bg-gray-500 `
        } ${className??""} text-white font-bold py-2.5 px-5 rounded w-fit`
      }
      disabled={grayedOut}
    >
      {children}
    </button>)
  }

  function renderAnchor(){
    return(<Link
      className={
        `${
          !grayedOut
            ? `${buttonStyle()} `
            : `bg-gray-500 `
        } ${className??""} text-white font-bold py-2.5 px-5 rounded w-fit`
      }
      to={href?href:""}
      onClick={handleClick??undefined}
    >
      {children}
    </Link>)
  }
  return href?renderAnchor():renderButton();
}
