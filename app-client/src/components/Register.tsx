import React from "react";
import AnimatedInput from "./AnimatedInput";
import "./Login.scss";

interface RegisterProps {
  loginOnClick: () => void;
}

async function postRegister(username: string, password: string) {
  const res = await fetch("/api/register", {
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
  const error = await res.json();
  console.log(error);
  return { success: false, message: error.message };
}

export default function Register({ loginOnClick }: RegisterProps) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const [invalidPassword, setInvalidPassword] = React.useState(false);
  const [registerError, setRegisterError] = React.useState("");
  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== password2) {
      setInvalidPassword(true);
      return;
    }
    const res = await postRegister(username, password);
    if (res.success) {
      loginOnClick();
    } else {
      setRegisterError("Register failed"); //TODO : display error message
    }
  };

  return (
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
          <span className={"link"} onClick={loginOnClick}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
