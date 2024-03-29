import React, { HTMLInputTypeAttribute } from "react";

interface AnimatedInputProps {
  type: HTMLInputTypeAttribute;
  label: string;
  id: string;
  autofocus: boolean;
  required: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string;
}

export default function AnimatedInput({
  type,
  label,
  id,
  autofocus,
  required,
  onChange,
  defaultValue,
}: AnimatedInputProps) {
  return (
    <React.StrictMode>
      <div className={"relative w-full px-2 py-6 sm:py-0 sm:w-96 sm:px-0 aspect-[6/1] text-blue-500 my-2"}>
        <input
          id={id}
          type={type}
          placeholder={" "}
          autoFocus={autofocus}
          autoComplete={"off"}
          required={required}
          onChange={onChange}
          className={
            "absolute w-full h-full top-0 left-0 border-2 border-blue-600 outline-none text-xl bg-transparent focus:border-blue-300 peer pl-3 rounded-md"
          }
          defaultValue={defaultValue}
        />
        <label htmlFor={id} className={"absolute left-0 top-[50%] -translate-y-1/2 text-xl cursor-text select-none ml-1 px-2 duration-150 peer-focus:top-0 peer-focus:opacity-0 peer-focus:text-lg peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:opacity-0 peer-[:not(:placeholder-shown)]:text-lg"}>
          {label}
        </label>
      </div>
    </React.StrictMode>
  );
}
