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
    <div className="flex w-screen justify-evenly items-center absolute bottom-10 left-0 z-10 text-slate-900">
      <div className="grid grid-cols-3 grid-rows-3">
        <span></span>
        <button className="bg-slate-300 aspect-[1/1] rounded-tl-2xl rounded-tr-2xl w-[10vw]" ref={upButton}></button>
        <span></span>
        <button className="bg-slate-300 aspect-[1/1] rounded-tl-2xl rounded-bl-2xl" ref={leftButton}></button>
        <span></span>
        <button className="bg-slate-300 aspect-[1/1] rounded-tr-2xl rounded-br-2xl" ref={rightButton}></button>
        <span></span>
        <button className="bg-slate-300 aspect-[1/1] rounded-bl-2xl rounded-br-2xl" ref={downButton}></button>
        <span></span>

      </div>
      <button className="bg-slate-300 rounded h-fit px-5 py-2.5" ref={dashButton}>DASH</button>
      <button className="bg-slate-300 rounded h-fit px-5 py-2.5" ref={shieldButton}>SHIELD</button>
    </div>
  );
}
