import { Link } from "react-router-dom";

function randomImage() {
  const number = Math.floor(Math.random() * 3) + 1;

  console.log(number);

  switch (number) {
    case 1:
      return (
        <div
          className={
            "grow w-full bg-contain bg-no-repeat bg-center bg-[url('/assets/static-pages/monster.svg')]"
          }
        ></div>
      );
    case 2:
      return (
        <div
          className={
            "grow w-full bg-contain bg-no-repeat bg-center bg-[url('/assets/static-pages/space.svg')]"
          }
        ></div>
      );
    case 3:
      return (
        <div
          className={
            "grow w-full bg-contain bg-no-repeat bg-center bg-[url('/assets/static-pages/robot.svg')]"
          }
        ></div>
      );
    default:
      return (
        <div
          className={
            "grow w-full bg-contain bg-no-repeat bg-center bg-[url('/assets/static-pages/monster.svg')]"
          }
        ></div>
      );
  }
}

export default function Page404() {
  return (
    <div className={"flex flex-col w-full"}>
      <div className={"mt-8"}>
        <h1 className={"text-6xl font-bold"}>Unable to find the page</h1>
        <br />
        <p className={"text-xl mt-4"}>
          The page you are looking for does not exist...
          <br />
          If you are lost try returning to the{" "}
          <Link to={"/"} className={"font-bold text-blue-400"}>
            home page
          </Link>
          .
        </p>
      </div>
      {randomImage()}
      <div className={"flex justify-end text-gray-400 font-black my-4 mx-8"}>
        <a href="https://storyset.com/web">Web illustrations by Storyset</a>
      </div>
    </div>
  );
}
