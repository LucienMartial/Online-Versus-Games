import { StrictMode } from "react";

interface OverviewProps {
  username: string;
}

function Overview({ username }: OverviewProps) {
  return (
    <StrictMode>
      <div>{username}'s overview tab</div>
    </StrictMode>
  );
}

export default Overview;
