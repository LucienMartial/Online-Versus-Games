import { StrictMode, useContext } from "react";
import "./style.scss";
import { ServerMessage } from "../../../../app-shared/types";
import { UserContext } from "../../App";

interface ChatMessageProperties {
  message: ServerMessage;
}

function ChatMessage({ message }: ChatMessageProperties) {
  const username = useContext(UserContext);
  return (
    <StrictMode>
      <div
        className={
          message.sender === username ? "self-message" : "other-message"
        }
      >
        <section>
          <p>From {message.sender === username ? "me" : message.sender}</p>
          <br />
          <p>
            At {message.date.getHours()}:{message.date.getMinutes()}
          </p>
          <br />
        </section>
        <section>{message.content}</section>
      </div>
    </StrictMode>
  );
}

export default ChatMessage;
