interface Message {
  content: string;
  date: string;
}

interface Login {
  username: string;
}

interface Checker {
  status: number;
  message: string;
}

export type { Message, Login, Checker };
