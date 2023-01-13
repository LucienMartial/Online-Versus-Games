import { useEffect, useState } from "react";
import { Error } from "../../../app-shared/types";

function useAuth() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await fetch("api/cookie-checker");
      if (res.status === 200) {
        setIsAuth(true);
        return;
      }
      const error: Error = await res.json();
      console.error("Could not autheticate with cookie:", error.message);
      setIsAuth(false);
    };
    fetchStatus();
  });

  return isAuth;
}

export { useAuth };
