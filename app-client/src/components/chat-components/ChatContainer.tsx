import { StrictMode, useState, useRef, useEffect, FormEvent } from "react";
import { Room } from "colyseus.js";
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

  function submitMessage(event: FormEvent) {
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

  const TEST_MESSAGE: ServerMessage = {
    content: "TEST",
    sender: "ME",
    date: new Date(),
  };

  const TEST_MESSAGE_2: ServerMessage = {
    content: "TEST",
    sender: "Macot",
    date: new Date(),
  };

  return (
    <StrictMode>
      <div
        className={
          "bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-md min-h-0  h-full w-full sm:w-auto flex flex-col sm:aspect-[16/9]"
        }
      >
        <div>
          <h1 className={"font-bold text-lg mx-3 my-2 text-center"}>
            What do you want to talk about?
          </h1>
        </div>
        <div
          ref={chatBoxRef}
          className={
            "h-48 overflow-y-auto border-solid border-y border-white grow"
          }
        >
          {renderChatElements()}
        </div>
        <form action="" onSubmit={submitMessage} className={"m-0 p-0"}>
          <input
            ref={inputReference}
            type="text"
            placeholder="Type your message here"
            className={
              "placeholder:text-xl rounded box-border m-0 py-3 px-5 w-full h-full bg-blue-800 outline-none"
            }
          />
        </form>
      </div>
    </StrictMode>
  );
}

export default ChatContainer;
