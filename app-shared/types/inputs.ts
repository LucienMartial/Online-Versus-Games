type KeyInputs = "left" | "right" | "up" | "down" | "dash";

interface Inputs {
  keys: Record<KeyInputs, boolean>;
  mouse: boolean;
}

interface InputsData {
  time: number;
  inputs: Inputs;
}

export { KeyInputs, InputsData, Inputs };
