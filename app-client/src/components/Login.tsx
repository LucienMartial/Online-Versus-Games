import React from "react";
import "./Login.scss";
import AnimatedInput from "./AnimatedInput";
import { Link } from "react-router-dom";

interface LoginProps {
  tryLogin: (username: string, password: string) => Promise<void>;
}

function Login({ tryLogin }: LoginProps) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    // login
    try {
      await tryLogin(username, password);
    } catch (e) {
      if (e instanceof Error) {
        setErrorMessage(e.message);
      }
    }
  };

  return (
    <React.StrictMode>
      <div className={"login"}>
        <form action="" onSubmit={login}>
          <h1>WELCOME !</h1>
          <AnimatedInput
            type={"text"}
            id={"username"}
            label={"Username"}
            autofocus={true}
            required={true}
            onChange={(e) => setUsername(e.target.value)}
          />
          <AnimatedInput
            type={"password"}
            label={"Password"}
            id={"password"}
            autofocus={false}
            required={true}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMessage && <p className={"error"}>{errorMessage}</p>}
          <button type="submit">Login</button>
          <p>
            No account yet ?{" "}
            <Link to={"/register"} className={"link"}>
              Create an account
            </Link>
          </p>
          <footer>
            <Link to={"/privacy"} className={"link"}>
              Privacy Policy
            </Link>
            <Link to={"/acknowledgment"} className={"link"}>
              Acknowledgment
            </Link>
          </footer>
        </form>
      </div>
    </React.StrictMode>
  );
}

export default Login;
