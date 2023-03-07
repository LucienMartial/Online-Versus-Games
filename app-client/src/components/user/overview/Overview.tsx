import {
  StrictMode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { FriendsContext, SocialContext, UserContext } from "../../../App";
import LoadingPage from "../../LoadingPage";
import { FiTrash, FiUserPlus } from "react-icons/fi";
import StatCard from "./StatCard";
import { Profile } from "../../../../../app-shared/types";
import { DiscWarStats } from "../../../../../app-shared/disc-war/types";

interface OverviewProps {
  username: string;
  handleRemoveAccount?: () => Promise<void>;
  profileData: Profile<DiscWarStats>;
}

function Overview({
  username,
  handleRemoveAccount,
  profileData,
}: OverviewProps) {
  const { friendsRequestsData, tryGetFriends, sendFriendRequest } = useContext(
    FriendsContext,
  );
  const [alreadyFriend, setAlreadyFriend] = useState(false);
  const [loading, setLoading] = useState(true);

  // friend request
  const sendRequest = useCallback(async () => {
    try {
      const userId = await sendFriendRequest(username);
      socialRoom?.send("request:new", userId);
      setAlreadyFriend(true);
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
    }
  }, [username]);

  // check if it's own user profile
  const userData = useContext(UserContext);
  const sameUser = userData.username === username;

  const checkIfFriend = useCallback(() => {
    if (!friendsRequestsData.current) return;
    setAlreadyFriend(
      sameUser ||
        friendsRequestsData.current.friendsData.friends.some(
          (friend) => friend.username === username,
        ) ||
        friendsRequestsData.current.requestsData.some(
          (request) =>
            request.expeditorName === username ||
            request.recipientName === username,
        ),
    );
  }, [username, profileData]);

  const removeAccount = () => {
    if (confirm("Are you sure you want to delete your account?")) {
      handleRemoveAccount?.().catch((e) => console.log(e));
    }
  };

  // real time update of friend status
  const { socialRoom } = useContext(SocialContext);
  useEffect(() => {
    if (!socialRoom) return;
    socialRoom.removeAllListeners();
    socialRoom.onMessage("*", async (type, message) => {
      switch (type) {
        case "request:new":
        case "request:remove":
        case "friend:remove":
          await tryGetFriends(false);
          checkIfFriend();
          break;
      }
    });
  }, [socialRoom, profileData]);

  // load page
  useEffect(() => {
    const load = async () => {
      await tryGetFriends(true);
      checkIfFriend();
      setLoading(false);
    };
    load();
    return () => {
      setLoading(true);
    };
  }, [profileData]);

  // useful for stats
  const average = (stat: number) => {
    return Number.parseFloat(
      (stat / (profileData.games > 0 ? profileData.games : 1)).toFixed(1),
    );
  };
  const winrate = profileData.games > 0
    ? Number.parseFloat(
      ((profileData.wins / profileData.games) * 100).toFixed(2),
    )
    : 100;
  const score = `${average(profileData.stats.kills)}/${
    average(
      profileData.stats.deaths,
    )
  }/${average(profileData.stats.shieldCatches)}`;
  const shots = profileData.stats.lineShots + profileData.stats.curveShots;

  const pageStyle = "grow flex flex-col justify-center items-center mt-4 px-2 ";

  if (loading) {
    return (
      <div className={pageStyle + "h-full"}>
        <LoadingPage />
      </div>
    );
  }

  return (
    <StrictMode>
      <div
        className={pageStyle +
          "md:px-6 w-full max-w-screen-xl h-screen justify-between self-center overflow-auto"}
      >
        <section className="flex justify-between items-center  gap-1 mt-2 w-full">
          <div className="flex gap-5 items-center">
            <h1 className="text-5xl font-medium">{username}</h1>
            {!alreadyFriend && (
              <button
                className="flex items-center text-xl gap-2 bg-blue-600 px-2.5 py-2.5 rounded-2xl hover:bg-blue-700"
                onClick={sendRequest}
              >
                <FiUserPlus className="text-xl" />
              </button>
            )}
          </div>
          {handleRemoveAccount && sameUser && (
            <button
              className="flex items-center text-lg gap-2 bg-red-700 px-2 py-1.5 rounded-xl hover:bg-red-800 text-slate-200"
              onClick={removeAccount}
            >
              <FiTrash />
              <p className="mt-0.5 font-medium">Delete my account</p>
            </button>
          )}
        </section>
        <section className="grow m-auto w-full mt-5 mb-1 grid md:grid-cols-5 gap-3 h-fit">
          <section className="rounded-md grid grid-cols-2 gap-2 col-span-3 row-span-1 p-2">
            <div className="flex flex-col justify-center gap-2 bg-white/40 dark:bg-black/40 backdrop-blur-md p-2">
              <h2 className="text-5xl">Winrate</h2>
              <span className="text-5xl">{winrate}%</span>
            </div>
            <div className="flex flex-col justify-center rounded-md gap-2 bg-white/40 dark:bg-black/40 backdrop-blur-md p-2">
              <h2 className="text-5xl">Games</h2>
              <span className="text-5xl">{profileData.games}</span>
            </div>
            <div className="flex flex-col col-span-2 justify-center rounded-md gap-2 bg-white/40 dark:bg-black/40 backdrop-blur-md p-2">
              <h2 className="text-5xl">Score</h2>
              <span className="text-5xl">{score}</span>
            </div>
          </section>
          <section className="col-span-3 md:col-span-2 grid grid-cols-2 gap-2 p-2">
            <StatCard
              name="Death"
              average={average(profileData.stats.deaths)}
              total={profileData.stats.deaths}
            />
            <StatCard
              name="Kill"
              average={average(profileData.stats.kills)}
              total={profileData.stats.kills}
            />
            <StatCard
              name="Dash"
              average={average(profileData.stats.dashes)}
              total={profileData.stats.dashes}
            />
            <StatCard name="Shot" average={average(shots)} total={shots} />
          </section>
          <section className="grow p-2 col-span-3 md:col-span-5 grid grid-cols-2 md:grid-cols-4 gap-2">
            <StatCard
              name="Line Shot"
              average={average(profileData.stats.lineShots)}
              total={profileData.stats.lineShots}
            />
            <StatCard
              name="Curve Shot"
              average={average(profileData.stats.curveShots)}
              total={profileData.stats.curveShots}
            />
            <StatCard
              name="Shield"
              average={average(profileData.stats.shields)}
              total={profileData.stats.shields}
            />
            <StatCard
              name="Shield Catch"
              average={average(profileData.stats.shieldCatches)}
              total={profileData.stats.shieldCatches}
            />
          </section>
        </section>
      </div>
    </StrictMode>
  );
}

export default Overview;
