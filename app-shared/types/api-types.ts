interface Message {
  content: string;
  date: string;
}

interface Login {
  username: string;
}

interface Error {
  message: string;
}

export type { Error, Message, Login };
