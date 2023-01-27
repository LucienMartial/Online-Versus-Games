import { ReactNode, StrictMode } from "react";
import Footer from "../lib/Footer";
import AppLink from "../lib/AppLink";

function StaticPage({ children }: { children?: ReactNode }) {
  return (
    <StrictMode>
      <div className="flex flex-col w-screen justify-between overflow-auto">
        <div className="p-4 border-b-2 border-slate-700 backdrop-blur-md sticky top-0">
          <AppLink to="/home">Back Home</AppLink>
        </div>
        <article className="prose prose-invert mx-auto w-full prose-lg py-8 pb-12">
          {children}
        </article>
        <Footer />
      </div>
    </StrictMode>
  );
}

export default StaticPage;
