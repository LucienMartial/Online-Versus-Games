import { StrictMode } from "react";
import { useNavigate } from "react-router-dom";
import AppButton from "./AppButton";

interface NavbarProps {
  tryLogout: () => Promise<void>;
}

function Navbar({ tryLogout }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <StrictMode>
      <header className="flex justify-between p-2 border-b-2 border-slate-700">
        <AppButton color={"regular"} onClick={() => navigate("/home")}>Home</AppButton>
        <section className="flex gap-3">
          <AppButton color={"regular"} onClick={() => navigate("/user")}>Profile</AppButton>
          <AppButton color={"regular"} onClick={tryLogout}>Logout</AppButton>
        </section>
      </header>
    </StrictMode>
  );
}

export default Navbar;
