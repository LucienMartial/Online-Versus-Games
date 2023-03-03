import { Ref, RefObject, useEffect, useState } from "react";

interface GameKeyboardProps {
  leftButton: Ref<HTMLButtonElement>;
  rightButton: Ref<HTMLButtonElement>;
  upButton: Ref<HTMLButtonElement>;
  downButton: Ref<HTMLButtonElement>;
  dashButton: Ref<HTMLButtonElement>;
  counterButton: Ref<HTMLButtonElement>;
  curveButton: RefObject<HTMLButtonElement>;
}

export default function GameKeyboard({
  leftButton,
  rightButton,
  upButton,
  downButton,
  dashButton,
  counterButton: counterButton,
  curveButton: curveButton,
}: GameKeyboardProps) {
  const [curveTouched, setCurveTouched] = useState(false);

  useEffect(() => {
    if (curveButton) {
      curveButton.current!.ontouchstart = () => {
        setCurveTouched(true);
      };
      curveButton.current!.ontouchend = () => {
        setCurveTouched(false);
      };
    }
  }, [curveButton]);

  return (
    <div className="flex w-screen justify-evenly items-center text-slate-900 flex-wrap">
      <div className="grid grid-cols-3 grid-rows-3">
        <span></span>
        <button
          className="bg-slate-300 aspect-[1/1] rounded-tl-2xl rounded-tr-2xl w-[12vw]"
          ref={upButton}
        >
        </button>
        <span></span>
        <button
          className="bg-slate-300 aspect-[1/1] rounded-tl-2xl rounded-bl-2xl"
          ref={leftButton}
        >
        </button>
        <span></span>
        <button
          className="bg-slate-300 aspect-[1/1] rounded-tr-2xl rounded-br-2xl"
          ref={rightButton}
        >
        </button>
        <span></span>
        <button
          className="bg-slate-300 aspect-[1/1] rounded-bl-2xl rounded-br-2xl"
          ref={downButton}
        >
        </button>
        <span></span>
      </div>
      <div className="flex flex-col gap-3">
        <button
          className="bg-slate-300 rounded h-fit px-5 py-2.5"
          ref={dashButton}
        >
          DASH
        </button>
        <button
          className="bg-slate-300 rounded h-fit px-5 py-2.5"
          ref={counterButton}
        >
          SHIELD
        </button>
        <button
          className={`rounded h-fit px-5 py-2.5 ${
            curveTouched ? "bg-slate-600" : "bg-slate-300"
          }`}
          ref={curveButton}
        >
          CURVE
        </button>
      </div>
    </div>
  );
}
