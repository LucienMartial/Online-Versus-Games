import React from "react";
import "./Login.scss";

function Login({onLogin}: { onLogin: () => void }) {
  const usernameRef = React.useRef<HTMLInputElement>(null);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameRef.current?.value === "") {
      usernameRef.current?.focus();
      return;
    }
    onLogin();
  }

  return (
      <div className={"login"}>
        <form action="">
          <h1>WELCOME !</h1>
          <div className={"container"}>
          <input id="username" type="text" placeholder={" "} ref={usernameRef} autoFocus={true} autoComplete={"off"}/>
          <label htmlFor="username" className={"movingLabel"}>Username</label>
        </div>
        <div className={"container"}>
          <input id="password" type="password" placeholder={" "}/>
          <label htmlFor="password" className={"movingLabel"}>Password</label>
        </div>
        <button type="submit" onClick={login}>Login</button>
        </form>
      </div>
  )
}

export default Login;