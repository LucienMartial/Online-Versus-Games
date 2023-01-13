import React from "react";
import "./Login.scss";

interface LoginProps {
  onLogin: () => void;
}

function Login({onLogin}: LoginProps) {
  const usernameRef = React.useRef<HTMLInputElement>(null);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameRef.current?.value === "") {
      usernameRef.current?.focus();
      return;
    }
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameRef.current?.value,
      }),
    });

    console.log(res);
    const jsonres = await res.json();
    console.log(jsonres);
    
    onLogin();
  }

  return (
      <div className={"login"}>
        <form action="" onSubmit={login}>
          <h1>WELCOME !</h1>
          <div className={"container"}>
            <input id="username" type="text" placeholder={" "} ref={usernameRef} autoFocus={true} autoComplete={"off"}/>
            <label htmlFor="username" className={"movingLabel"}>Username</label>
          </div>
          <div className={"container"}>
            <input id="password" type="password" placeholder={" "}/>
            <label htmlFor="password" className={"movingLabel"}>Password</label>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
  )
}

export default Login;