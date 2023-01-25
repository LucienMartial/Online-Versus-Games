interface Message {
  content: string;
  date: Date;
}

interface Login {
  username: string;
}

interface Error {
  message: string;
}

export type { Error, Message, Login };
