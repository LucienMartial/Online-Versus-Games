interface keybind {
  key: string[];
  description: string;
}

interface gameInfosType {
  name: string;
  queueName: string;
  id: string;
  description: string;
  keybinds: keybind[];
}

export default gameInfosType;
