import React from "react";
import AnimatedInput from "./AnimatedInput";
import AppLink from "../lib/AppLink";
import AppError from "./AppError";
import Footer from "../lib/Footer";
import AppButton from "../lib/AppButton";

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
      <div className="flex flex-col w-screen justify-between">
        <form
          action=""
          onSubmit={login}
          className={"flex grow justify-center items-center flex-col gap-8 mx-4 sm:mx-0"}
        >
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
          <AppButton color={"regular"} type={"submit"}>
            Login
          </AppButton>
          <p>
            No account yet ?{" "}
            <AppLink to={"/register"}>Create an account</AppLink>
          </p>
        </form>
        <Footer />
      </div>
    </React.StrictMode>
  );
}

export default Login;
