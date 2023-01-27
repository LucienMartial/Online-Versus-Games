import { StrictMode, useState, useRef, useEffect } from "react";
import { Room } from "colyseus.js";
import "./style.scss";
import ChatMessage from "./ChatMessage";
import { ClientMessage, ServerMessage } from "../../../../app-shared/types";

interface ChatContainerProperties {
  chatRoom: Room;
}

function ChatContainer({ chatRoom }: ChatContainerProperties) {
  const [messages, setChatRoom] = useState<ServerMessage[]>([]);
  const inputReference = useRef<HTMLInputElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  chatRoom.onMessage("message", receiveMessage);

  function renderChatElements() {
    return messages.map((message) => {
      return (
        <ChatMessage message={message} key={message.date.getMilliseconds()} />
      );
    });
  }

  function submitMessage(event: React.FormEvent) {
    event.preventDefault();
    const messageContent = inputReference.current?.value;
    inputReference.current!.value = "";

    // send message to server
    const message: ClientMessage = {
      content: messageContent!.trim(),
    };
    chatRoom.send("message", message);
  }

  function receiveMessage(message: ServerMessage) {
    setChatRoom([...messages!, message]);
  }

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <StrictMode>
      <main className={"temp-class"}> //TODO remove temp-class after tailwindcss styling
        <section className="chatMessage chatOutline">
          <h1>Tell the love to your opponent</h1>
          <section ref={chatBoxRef} className="chatMessage chatBox">
            {renderChatElements()}
          </section>
          <section className="chatMessage chatInput">
            <form action="" onSubmit={submitMessage}>
              <input
                ref={inputReference}
                type="text"
                placeholder="Type your message here"
              />
            </form>
          </section>
        </section>
      </main>
    </StrictMode>
  );
}

export default ChatContainer;
