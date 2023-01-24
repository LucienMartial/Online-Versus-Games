import React from "react";
import AnimatedInput from "./AnimatedInput";
import "./Login.scss";
import { Link } from "react-router-dom";

// TODO: checkbox stating that the user agree to the privacy policy
// TODO: footer component

interface RegisterProps {
  tryRegister: (username: string, password: string) => Promise<void>;
}

export default function Register({ tryRegister }: RegisterProps) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const [invalidPassword, setInvalidPassword] = React.useState(false);
  const [registerError, setRegisterError] = React.useState("");

  const register = async (e: React.FormEvent) => {
    e.preventDefault();

    // validation password does not match
    if (password !== password2) {
      setInvalidPassword(true);
      return;
    }

    // ask server to register
    try {
      await tryRegister(username, password);
    } catch (e) {
      if (e instanceof Error) setRegisterError(e.message);
    }
  };

  return (
    <>
      <div className={"register"}>
        <form action="" onSubmit={register}>
          <h1>Create an account</h1>
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
            required={false}
            onChange={(e) => setPassword(e.target.value)}
          />
          <AnimatedInput
            type={"password"}
            label={"Confirm your password"}
            id={"password2"}
            autofocus={false}
            required={false}
            onChange={(e) => setPassword2(e.target.value)}
          />
          {invalidPassword && <p className={"error"}>Passwords must match</p>}
          {registerError && <p className={"error"}>{registerError}</p>}
          <button type="submit">Register</button>
          <p>
            Already have an account ?{" "}
            <Link to={"/login"} className={"link"}>
              Login
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
    </>
  );
}
