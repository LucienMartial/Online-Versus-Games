import React from "react";
import "./Login.scss";
import AnimatedInput from "./AnimatedInput";

interface LoginProps {
  setLoggedIn: (isLoggedIn: boolean) => void;
  createAccountOnClick: () => void;
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

function Login({setLoggedIn, createAccountOnClick}: LoginProps) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();

    // login
    const isLoggedIn = await postLogin(username);
    setLoggedIn(isLoggedIn);
  };

  return (
      <div className={"login"}>
        <form action="" onSubmit={login}>
          <h1>WELCOME !</h1>
          <AnimatedInput type={"text"} id={"username"} label={"Username"} autofocus={true} required={true}
                         onChange={(e) => setUsername(e.target.value)}/>
          <AnimatedInput type={"password"} label={"Password"} id={"password"} autofocus={false} required={false}
                         onChange={(e) => setPassword(e.target.value)}/>
          <button type="submit">Login</button>
          <p>No account yet ? <span className={"link"} onClick={createAccountOnClick}>Create an account</span></p>
        </form>
      </div>
  );
}

export default Login;
