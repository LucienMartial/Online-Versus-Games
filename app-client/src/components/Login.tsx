import React from "react";
import AnimatedInput from "./AnimatedInput";
import AppLink from "./AppLink";
import AppError from "./AppError";

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
        <form action="" onSubmit={login} className={"h-screen flex justify-center items-center flex-col gap-8"}>
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
          {errorMessage && <AppError>{errorMessage}</AppError>}
          <button type="submit" className={"bg-themelight"}>Login</button>
          <p>
            No account yet ?{" "}
            <AppLink to={"/register"} >
              Create an account
            </AppLink>
          </p>
          <footer>
            <AppLink to={"/privacy"}>
              Privacy Policy
            </AppLink>
            <AppLink to={"/acknowledgment"}>
              Acknowledgment
            </AppLink>
          </footer>
        </form>
      </div>
    </React.StrictMode>
  );
}

export default Login;
