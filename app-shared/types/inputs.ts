import SAT from "sat";

type KeyInputs = "left" | "right" | "up" | "down" | "dash";

interface Inputs {
  keys: Record<KeyInputs, boolean>;
  mouse: boolean;
  mousePos: SAT.Vector;
}

interface InputsData {
  time: number;
  inputs: Inputs;
}

export type { KeyInputs, InputsData, Inputs };
