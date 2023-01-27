import { StrictMode, useCallback, useContext, useEffect, useMemo } from "react";
import { FriendsContext } from "../../App";
import AppButton from "../lib/AppButton";

interface OverviewProps {
  username: string;
  handleRemoveAccount?: () => Promise<void>;
  isUser?: boolean;
}

function Overview({ username, handleRemoveAccount, isUser }: OverviewProps) {
  const { friendsData, tryGetFriends } = useContext(FriendsContext);

  useEffect(() => {
    console.log("load OVERVIEW");
    console.log("FRIENDS", friendsData.current);
    return () => {
      console.log("UNLOAD OVERVIEW");
    };
  }, [username]);

  return (
    <StrictMode>
      <div className={"flex flex-col justify-center items-center mt-4"}>
        <h1>{username}</h1>
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
