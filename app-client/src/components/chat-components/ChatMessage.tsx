import { StrictMode, useContext } from "react";
import "./style.scss";
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
            ? "chatMessage self-message"
            : "chatMessage other-message"
        }
      >
        <section className="chatMessage informations">
          <p>
            From {message.sender === username ? "me" : message.sender} at{" "}
            {timeFormat(message.date.getHours())}:
            {timeFormat(message.date.getMinutes())}
          </p>
          <br />
        </section>
        <section className="chatMessage content">{message.content}</section>
      </div>
    </StrictMode>
  );
}

export default ChatMessage;
