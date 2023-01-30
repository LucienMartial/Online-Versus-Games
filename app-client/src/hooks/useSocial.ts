import { Client, Room } from "colyseus.js";
import { useCallback, useState } from "react";

interface useSocialRes {
  socialRoom: Room | undefined;
  tryConnectSocial: (client: Client) => Promise<void>;
  destroy: () => void;
}

function useSocial(): useSocialRes {
  const [socialRoom, setSocialRoom] = useState<Room>();

  const tryConnectSocial = useCallback(async (client: Client) => {
    try {
      const room = await client.joinOrCreate("social");
      setSocialRoom(room);
      console.log("successfully joined social room");
    } catch (e) {
      if (e instanceof Error)
        console.error("Could not join social room", e.message);
    }
  }, []);

  const destroy = useCallback(() => {
    socialRoom?.leave();
    setSocialRoom(undefined);
  }, [socialRoom]);

  return {
    socialRoom,
    tryConnectSocial,
    destroy,
  };
}

export default useSocial;
export type { useSocialRes };
