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

  const handleUserSearch = (e: FormEvent) => {
    e.preventDefault();
    const username = searchbarRef.current?.value.trim() ?? "";
    if (username === "") return;
    searchbarRef.current!.value = "";
    navigate(`/user/${username}`);
  };

  return (
    <StrictMode>
      <header className="z-10 flex w-screen flex-row justify-start border-slate-700 border-b p-2 sm:justify-between backdrop-blur">
        <input
          id="navToggler"
          type={"checkbox"}
          className={"peer hidden"}
        ></input>
        <label
          htmlFor="navToggler"
          className={
            "relative block aspect-[1/1] h-10 sm:hidden peer-checked:[&>.dash-c]:bg-transparent peer-checked:[&>.dash-c]:before:bottom-0 peer-checked:[&>.dash-c]:before:-rotate-45 peer-checked:[&>.dash-c]:after:top-0 peer-checked:[&>.dash-c]:after:rotate-45"
          }
        >
          <div
            className={
              'duration-150 dash-c w-full bg-slate-300 h-1 absolute top-[50%] -translate-y-1/2 before:content-[""] before:absolute before:bottom-3 before:left-0 before:bg-slate-300 before:w-full before:h-full before:duration-150 after:content-[""] after:absolute after:top-3 after:left-0 after:bg-slate-300 after:w-full after:h-full after:duration-150'
            }
          ></div>
        </label>
        <nav
          className={
            "flex h-0 w-full flex-col gap-3 overflow-hidden duration-150 peer-checked:h-full sm:h-full sm:flex-row sm:justify-between"
          }
        >
          <section
            className={"flex h-full flex-col items-center gap-3 sm:flex-row"}
          >
            <AppButton color={"regular"} onClick={() => navigate("/home")}>
              Home
            </AppButton>
            <form
              className={"flex h-full"}
              action=""
              onSubmit={handleUserSearch}
            >
              <input
                type="text"
                className={
                  "h-full bg-slate-800 rounded outline-none text-white pl-2 py-2 sm:py-0"
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
            <AppButton color={"regular"} onClick={() => navigate("/shop")}>
              Shop
            </AppButton>
            <AppButton color={"regular"} onClick={() => navigate("/user")}>
              Profile
            </AppButton>
            <AppButton color={"regular"} onClick={tryLogout}>
              Logout
            </AppButton>
          </section>
        </nav>
      </header>
    </StrictMode>
  );
}

export default Navbar;
