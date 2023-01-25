import { Link } from "react-router-dom";

export default function Page404() {
  return (
    <div className="404">
      <h1>404</h1>
      <h2>Page not found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to={"/"}>Go back to home</Link>
    </div>
  );
}
