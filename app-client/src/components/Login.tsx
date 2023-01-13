import React from "react";
import "./Login.scss";

interface LoginProps {
  setLoggedIn: (isLoggedIn: boolean) => void;
}

async function postLogin(username: string) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
    }),
  });
  // success
  if (res.status === 200) return true;
  // error
  console.log(await res.json());
  return false;
}

function Login({ setLoggedIn }: LoginProps) {
  const usernameRef = React.useRef<HTMLInputElement>(null);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameRef.current) return;

    // username
    const username = usernameRef.current.value;
    if (username === "") {
      usernameRef.current?.focus();
      return;
    }

    // login
    const isLoggedIn = await postLogin(username);
    setLoggedIn(isLoggedIn);
  };

  return (
    <div className={"login"}>
      <form action="" onSubmit={login}>
        <h1>WELCOME !</h1>
        <div className={"container"}>
          <input
            id="username"
            type="text"
            placeholder={" "}
            ref={usernameRef}
            autoFocus={true}
            autoComplete={"off"}
          />
          <label htmlFor="username" className={"movingLabel"}>
            Username
          </label>
        </div>
        <div className={"container"}>
          <input id="password" type="password" placeholder={" "} />
          <label htmlFor="password" className={"movingLabel"}>
            Password
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
