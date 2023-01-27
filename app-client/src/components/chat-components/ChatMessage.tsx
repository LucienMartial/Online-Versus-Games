import { StrictMode, useContext } from "react";
import { ServerMessage } from "../../../../app-shared/types";
import { UserContext } from "../../App";

interface ChatMessageProperties {
  message: ServerMessage;
}

function ChatMessage({ message }: ChatMessageProperties) {
  function timeFormat(time: number) {
    return time < 10 ? "0" + time : time;
  }

  const username = useContext(UserContext);
  return (
    <StrictMode>
      <div
        className={
          message.sender === username
            ? "float-right clear-both m-2 p-2 text-left text-white bg-blue-700 rounded-xl"
            : message.sender === "server"
            ? "float-left clear-both m-2 p-2 text-left text-white bg-red-600 rounded-xl"
            : "float-left clear-both m-2 p-2 text-left text-white bg-purple-600 rounded-xl"
        }
      >
        <section className={"text-sm mb-0 text-left"}>
          <p>
            From {message.sender === username ? "me" : message.sender} at{" "}
            {timeFormat(message.date.getHours())}:
            {timeFormat(message.date.getMinutes())}
          </p>
          <br />
        </section>
        <section className="text-xl text-left">{message.content}</section>
      </div>
    </StrictMode>
  );
}

export default ChatMessage;
