import SAT from "sat";

type KeyInputs = "left" | "right" | "up" | "down" | "dash" | "counter" | "curve";

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

export type { KeyInputs, InputsData, Inputs };
