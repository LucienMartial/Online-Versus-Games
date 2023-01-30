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
      <header className="flex justify-between p-2 border-b-2 border-slate-700">
        <section className={"flex gap-3"}>
          <AppButton color={"regular"} onClick={() => navigate("/home")}>
            Home
          </AppButton>
          <form className={"flex h-full"} action="" onSubmit={handleUserSearch}>
            <input
              type="text"
              className={
                "h-full bg-slate-800 rounded outline-none text-white pl-2"
              }
              placeholder={"Search a user"}
              ref={searchbarRef}
            />
            <button type={"submit"} className={"h-full px-2"}>
              <FaSearch className={"h-full"} />
            </button>
          </form>
        </section>
        <section className="flex gap-3">
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
      </header>
    </StrictMode>
  );
}

export default Navbar;
