import { ObjectId } from "mongodb";
import { useCallback, useEffect, useState } from "react";
import type { Error } from "../../../app-shared/types";
import { UserContextType } from "../App";

/**
 * Utils
 */

interface postRes {
  success: boolean;
  res?: Response;
  message?: string;
}

async function postData(path: string, body: {}): Promise<postRes> {
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  // success
  if (res.status === 200) return { success: true, res: res };
  // failed
  const error: Error = await res.json();
  return {
    success: false,
    message: error.message,
  };
}

/**
 * Check if already authentified with cookie
 */

async function checkAuth(): Promise<boolean> {
  const res = await fetch("/api/cookie-checker");
  if (res.status === 200) return true;
  try {
    const error: Error = await res.json();
    console.error("Could not authenticate with cookie:", error.message);
  } catch (e) {
    if (e instanceof Error)
      console.error("server reponse not valid in cookie-checker", e.message);
  }
  return false;
}

/**
 * Login
 */

async function postLogin(username: string, password: string): Promise<postRes> {
  return postData("/api/login", { username: username, password: password });
}

/**
 * Logout
 */

async function postLogout(): Promise<postRes> {
  return postData("/api/logout", {});
}

/**
 * Registration
 */

async function postRegister(
  username: string,
  password: string
): Promise<postRes> {
  return postData("/api/register", { username: username, password: password });
}

/**
 * Account removal
 */

async function postRemove(): Promise<postRes> {
  return postData("/api/remove-account", {});
}

/**
 * Manage connection, deconnection, registration and removal of account
 */

interface useAccountRes {
  loggedIn: boolean | null;
  tryLogin: (username: string, password: string) => Promise<void>;
  tryLogout: () => Promise<void>;
  tryRegister: (username: string, password: string) => Promise<void>;
  tryRemoveAccount: () => Promise<void>;
}

function useAccount(): useAccountRes {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  const tryLogin = useCallback(async (username: string, password: string) => {
    const { success, message, res } = await postLogin(username, password);
    if (!success || !res) throw new Error(message);
    const { id } = await res.json();
    const userData: UserContextType = {
      id: id,
      username: username,
    };
    localStorage.setItem("user-data", JSON.stringify(userData));
    setLoggedIn(true);
  }, []);

  const tryLogout = useCallback(async () => {
    const { success, message } = await postLogout();
    if (!success) throw new Error(message);
    setLoggedIn(false);
  }, []);

  const tryRegister = useCallback(
    async (username: string, password: string) => {
      const { success, message, res } = await postRegister(username, password);
      if (!success || !res) throw new Error(message);
      const { id } = await res.json();
      const userData: UserContextType = {
        id: id,
        username: username,
      };
      localStorage.setItem("user-data", JSON.stringify(userData));
      setLoggedIn(true);
    },
    []
  );

  const tryRemoveAccount = useCallback(async () => {
    const { success, message } = await postRemove();
    if (!success) throw new Error(message);
    localStorage.removeItem("username");
    setLoggedIn(false);
  }, []);

  // try to connect automaticly with cookie
  useEffect(() => {
    const load = async () => {
      const res = await checkAuth();
      if (res) setLoggedIn(true);
      else setLoggedIn(false);
    };
    load();
  }, []);

  return { loggedIn, tryLogin, tryLogout, tryRegister, tryRemoveAccount };
}

export default useAccount;
