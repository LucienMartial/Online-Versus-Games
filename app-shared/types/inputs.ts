import SAT from "sat";

type KeyInputs = "left" | "right" | "up" | "down" | "dash" | "counter";

interface Inputs {
  keys: Record<KeyInputs, boolean>;
  mouseLeft: boolean;
  mouseRight: boolean;
  mousePos: SAT.Vector;
}

interface InputsData {
  time: number;
  inputs: Inputs;
}

export type { KeyInputs, InputsData, Inputs };
