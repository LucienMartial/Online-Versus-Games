import { StrictMode, useState, useRef, useEffect } from "react";
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
      <main>
        <section
          className={
            "border-solid border-2 border-white rounded-xl p-px relative left-1/2 w-96 -translate-x-1/2"
          }
        >
          <h1 className={"text-lg mx-0 my-2 text-center"}>
            What do you want to talk about?
          </h1>
          <section
            ref={chatBoxRef}
            className={
              "border-solid border-t overflow-y-scroll border-white h-80 max-h-80 rounded-xl"
            }
          >
            {renderChatElements()}
          </section>
          <section
            className={
              "items-center justify-center mt-2 p-px w-full bg-blue-800 rounded-xl"
            }
          >
            <form
              action=""
              onSubmit={submitMessage}
              className={"h-full w-full"}
            >
              <input
                ref={inputReference}
                type="text"
                placeholder="Type your message here"
                className={
                  "placeholder:text-xl rounded box-border m-0 py-3 px-5 w-full h-1/4 bg-blue-800"
                }
              />
            </form>
          </section>
        </section>
      </main>
    </StrictMode>
  );
}

export default ChatContainer;
