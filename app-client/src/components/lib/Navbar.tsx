import { FormEvent, StrictMode, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AppButton from "./AppButton";
import { FaSearch } from "react-icons/all";

interface NavbarProps {
  tryLogout: () => Promise<void>;
}

function Navbar({ tryLogout }: NavbarProps) {
  const navigate = useNavigate();
  const searchbarRef = useRef<HTMLInputElement>(null);
  const navTogglerRef = useRef<HTMLInputElement>(null);

  const handleUserSearch = (e: FormEvent) => {
    e.preventDefault();
    const username = searchbarRef.current?.value.trim() ?? "";
    if (username === "") return;
    hideNavBar();
    searchbarRef.current!.value = "";
    navigate(`/user/${username}`);
  };

  const hideNavBar = () => {
    console.log(navTogglerRef.current);
    navTogglerRef.current!.checked = false;
  };

  return (
    <StrictMode>
      <header className="z-10 flex flex-row justify-start sm:bg-slate-200 sm:dark:bg-slate-800 mx-3 my-2.5 rounded-lg p-3 sm:justify-between">
        <input
          id="navToggler"
          type={"checkbox"}
          className={"peer hidden"}
          ref={navTogglerRef}
        ></input>
        <label
          htmlFor="navToggler"
          className={
            "z-20 relative block aspect-[1/1] h-10 sm:hidden peer-checked:[&>.dash-c]:bg-transparent peer-checked:[&>.dash-c]:before:bottom-0 peer-checked:[&>.dash-c]:before:-rotate-45 peer-checked:[&>.dash-c]:after:top-0 peer-checked:[&>.dash-c]:after:rotate-45"
          }
        >
          <div
            className={
              'duration-150 dash-c w-full bg-slate-700 dark:bg-slate-300 h-1 absolute top-[50%] -translate-y-1/2 before:content-[""] before:absolute before:bottom-3 before:left-0 before:bg-slate-700 dark:before:bg-slate-300 before:w-full before:h-full before:duration-150 after:content-[""] after:absolute after:top-3 after:left-0 after:bg-slate-700 dark:after:bg-slate-300 after:w-full after:h-full after:duration-150'
            }
          ></div>
        </label>
        <nav
          className={
            "absolute top-0 left-0 flex h-screen min-h-0 w-0 flex-col justify-center gap-3 overflow-hidden backdrop-blur duration-150 peer-checked:h-screen peer-checked:w-full peer-checked:px-20 sm:static sm:h-full sm:w-full sm:flex-row sm:justify-between sm:px-0 sm:backdrop-blur-0"
          }
        >
          <section className={"flex flex-col items-center gap-3 sm:flex-row"}>
            <AppButton
              className="!w-full sm:w-fit"
              color={"regular"}
              href={"/home"}
              onClick={hideNavBar}
            >
              Home
            </AppButton>
            <form
              className={"flex h-fit sm:h-full w-full"}
              action=""
              onSubmit={handleUserSearch}
            >
              <input
                type="text"
                className={
                  "h-full bg-slate-300 dark:bg-slate-700 rounded outline-none text-slate-900 dark:text-white pl-2 py-2.5 sm:py-0 grow"
                }
                placeholder={"Search a user"}
                ref={searchbarRef}
              />
              <button type={"submit"} className={"h-full px-2"}>
                <FaSearch className={"h-full"} />
              </button>
            </form>
          </section>
          <section className="flex flex-col items-center gap-3 sm:flex-row">
            <AppButton
              className="!w-full sm:w-fit"
              color={"regular"}
              href={"/shop"}
              onClick={hideNavBar}
            >
              Shop
            </AppButton>
            <AppButton
              className="!w-full sm:w-fit"
              color={"regular"}
              href={"/user"}
              onClick={hideNavBar}
            >
              Profile
            </AppButton>
            <AppButton
              className="!w-full sm:w-fit"
              color={"regular"}
              href={"/settings"}
              onClick={hideNavBar}
            >
              Settings
            </AppButton>
            <AppButton
              className="!w-full sm:w-fit"
              color={"regular"}
              onClick={() => {
                hideNavBar();
                tryLogout();
              }}
            >
              Logout
            </AppButton>
          </section>
        </nav>
      </header>
    </StrictMode>
  );
}

export default Navbar;
