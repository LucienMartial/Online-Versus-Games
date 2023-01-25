interface ServerMessage {
  content: string;
  sender: string;
  date: Date;
}

interface ClientMessage {
  content: string;
}

export { ServerMessage, ClientMessage };
