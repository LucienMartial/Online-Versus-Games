import React from "react";
import "./Login.scss";
import AnimatedInput from "./AnimatedInput";

interface LoginProps {
  setLoggedIn: (isLoggedIn: boolean) => void;
  createAccountOnClick: () => void;
}

async function postLogin(username: string, password: string) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
  // success
  if (res.status === 200) return { success: true };
  // error
  return { success: false , message: await res.json().then((data) => data.message)};
}

function Login({setLoggedIn, createAccountOnClick}: LoginProps) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();

    // login
    const res = await postLogin(username, password);
    if (res.success) {
        setLoggedIn(true);
    } else {
        setErrorMessage(res.message);
    }
  };

  return (
      <div className={"login"}>
        <form action="" onSubmit={login}>
          <h1>WELCOME !</h1>
          <AnimatedInput type={"text"} id={"username"} label={"Username"} autofocus={true} required={true}
                         onChange={(e) => setUsername(e.target.value)}/>
          <AnimatedInput type={"password"} label={"Password"} id={"password"} autofocus={false} required={false}
                         onChange={(e) => setPassword(e.target.value)}/>
            {errorMessage && <p className={"error"}>{errorMessage}</p>}
          <button type="submit">Login</button>
          <p>No account yet ? <span className={"link"} onClick={createAccountOnClick}>Create an account</span></p>
        </form>
      </div>
  );
}

export default Login;
