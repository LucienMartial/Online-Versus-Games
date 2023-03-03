import SAT from "sat";

type KeyInputs =
  | "left"
  | "right"
  | "up"
  | "down"
  | "space"
  | "shift";

interface Inputs {
  keys: Record<KeyInputs, boolean>;
  mainShootAction: boolean;
  secondaryShootAction: boolean;
  mousePos: SAT.Vector;
}

interface InputsData {
  time: number;
  inputs: Inputs;
}

export type { Inputs, InputsData, KeyInputs };
