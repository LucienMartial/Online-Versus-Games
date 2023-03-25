import { StrictMode } from "react";
import StaticPage from "./StaticPage";
import {useLocation} from "react-router-dom";
import useTitle from "../../hooks/useTitle";

function Privacy() {
  const {state} = useLocation();
  useTitle("Privacy Policy - Online Versus Games");
  return (
    <StrictMode>
      <StaticPage returnURL={state}>
        <h1>Privacy Policy</h1>
        <h2>What is this website</h2>
        <p>
          Hello! This website is firstly an online game based website where you
          can play, communicate and compete with other players and get statistic
          relative to your performance. Everything is open source and is made
          for an university project so you can actually take a look at the
          source code{" "}
          <a href="https://github.com/LucienMartial/Online-Versus-Game">here</a>
          .
        </p>
        <h2>Collected data</h2>
        <p>
          We are automatically collecting the following data based on your prior
          consentment.
        </p>
        <ul>
          <li>Data about the played games.</li>
          <li>Data about the preference and settings of the user.</li>
          <li>
            Data about the account when it's created, more specifically the
            username and password.
          </li>
          <li>
            Cookie containing the username, an authentified boolean and the
            experity date.
          </li>
          <li>
            Local storage containing the last game room id and the last session
            id of the user.
          </li>
        </ul>
        <h2>Use of the information</h2>
        <p>
          The personal data submitted will be used for the website administering
          and it's provided services. We use cookies saved on your computer for
          automatic connection and reconnection. We also use your local storage
          to reconnect you to your current game.
        </p>
        <h2>Rights</h2>
        <p>
          If wanted, all your personal data can be deleted using the option in
          your profile tab.
        </p>
      </StaticPage>
    </StrictMode>
  );
}

export default Privacy;
