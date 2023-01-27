import { StrictMode } from "react";
import AppButton from "../lib/AppButton";

interface OverviewProps {
  username: string;
  handleRemoveAccount?: () => Promise<void>;
  isUser?: boolean;
}

function Overview({ username, handleRemoveAccount, isUser }: OverviewProps) {
  return (
    <StrictMode>
      <div className={"flex flex-col justify-center items-center"}>
        <p>{username}'s overview tab</p>
        {handleRemoveAccount && isUser && (
          <AppButton color={"danger"} onClick={handleRemoveAccount}>
            Delete my account
          </AppButton>
        )}
      </div>
    </StrictMode>
  );
}

export default Overview;
