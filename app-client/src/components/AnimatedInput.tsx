import React, {HTMLInputTypeAttribute} from "react";
import "./AnimatedInput.scss";

interface AnimatedInputProps {
  type: HTMLInputTypeAttribute;
  label: string;
  id: string;
  autofocus: boolean;
  required: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AnimatedInput({type, label, id, autofocus, required, onChange}: AnimatedInputProps) {
  return (
      <div className={"container"}>
        <input id={id} type={type} placeholder={" "} autoFocus={autofocus} autoComplete={"off"} required={required} onChange={onChange} />
        <label htmlFor={id} className={"movingLabel"}>{label}</label>
      </div>
  )
}