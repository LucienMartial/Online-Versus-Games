import { Ref } from "react";

interface GameKeyboardProps {
  leftButton: Ref<HTMLButtonElement>;
  rightButton: Ref<HTMLButtonElement>;
  upButton: Ref<HTMLButtonElement>;
  downButton: Ref<HTMLButtonElement>;
  dashButton: Ref<HTMLButtonElement>;
  shieldButton: Ref<HTMLButtonElement>;
}

export default function GameKeyboard({
  leftButton,
  rightButton,
  upButton,
  downButton,
  dashButton,
  shieldButton,
}: GameKeyboardProps) {
  return (
    <div className="flex w-screen justify-evenly sm:hidden absolute bottom-0 left-0 z-10">
      <div className="flex aspect-[2/1]">
        <div className="flex flex-row items-center">
          <button ref={leftButton}>LEFT</button>
        </div>
        <div className="flex flex-col justify-between">
          <button ref={upButton}>UP</button>
          <button ref={downButton}>DOWN</button>
        </div>
        <div className="flex flex-row items-center">
          <button ref={rightButton}>RIGHT</button>
        </div>
      </div>
      <button ref={dashButton}>DASH</button>
      <button ref={shieldButton}>SHIELD</button>
    </div>
  );
}
