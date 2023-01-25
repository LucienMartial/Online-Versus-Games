import { StrictMode } from "react";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  tryLogout: () => Promise<void>;
}

function Navbar({ tryLogout }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <StrictMode>
      <header className="flex justify-between p-2 bg-blue-900">
        <button onClick={() => navigate("/home")}>Home</button>
        <section className="flex gap-3">
          <button onClick={() => navigate("/profile")}>Profile</button>
          <button onClick={tryLogout}>Logout</button>
        </section>
      </header>
    </StrictMode>
  );
}

export default Navbar;
