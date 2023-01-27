interface ServerMessage {
  content: string;
  sender: string;
  date: Date;
}

interface ClientMessage {
  content: string;
}

export type { ServerMessage, ClientMessage };
