import React, { useEffect } from "react";
import AnimatedInput from "./AnimatedInput";
import AppLink from "../lib/AppLink";
import AppError from "./AppError";
import Footer from "../lib/Footer";
import AppButton from "../lib/AppButton";
import { useLocation } from "react-router-dom";

interface RegisterProps {
  tryRegister: (username: string, password: string) => Promise<void>;
}

export default function Register({ tryRegister }: RegisterProps) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const [invalidPassword, setInvalidPassword] = React.useState(false);
  const [registerError, setRegisterError] = React.useState("");
  const { state } = useLocation();

  useEffect(() => {
    if (state?.params?.username) setUsername(state.params.username);
  }, [state]);

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
    <div className="flex flex-col w-screen justify-between items-center">
      <form
        action=""
        onSubmit={register}
        className={"text-blue-600 flex justify-center items-center flex-col gap-8 mx-4 sm:mx-0 my-auto w-fit h-fit bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/10 p-10 rounded"}
      >
        <h1 className="text-5xl">Create an account</h1>
        <AnimatedInput
          type={"text"}
          id={"username"}
          label={"Username"}
          autofocus={true}
          required={true}
          onChange={(e) => setUsername(e.target.value)}
          defaultValue={state?.params?.username || ""}
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
        <p className="flex">
          <input
            type={"checkbox"}
            id={"privacyCheckbox"}
            className={"w-4 h-4 rounded accent-themelighter mx-2"}
            required={true}
          />
          <label
            htmlFor={"privacyCheckbox"}
            className="text-sm -mt-0.5 inline-block"
          >
            Game progress and preferences may be stored on our servers and your
            device. <br /> We won't share your information without permission.
            <br />Please check the box above to confirm your agreement.
          </label>
        </p>
        {invalidPassword && <AppError>Passwords must match</AppError>}
        {registerError && <AppError>{registerError}</AppError>}
        <AppButton color={"regular"} type={"submit"}>
          Register
        </AppButton>
        <p>
          Already have an account ?{" "}
          <AppLink className={"text-blue-500"} to={"/login"}>Login</AppLink>
        </p>
      </form>
      <Footer
        returnURL={{ url: "/register", params: { username: username } }}
      />
    </div>
  );
}
