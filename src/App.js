import {
  BrowserRouter as Router,
  Routes,
  Route,
  // useNavigate,
} from "react-router-dom";
import "./App.css";
import Login from "./Components/Login/Login";
import { BackgroundProvider } from "./BackgroundContext";
// import Profile from "./Components/Profile/Profile";
import {
  AuthenticatedTemplate,
  MsalProvider,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { msalInstance } from "./services/authConfig.js";
// import Header from "./Components/Header.js";
import Dashboard from "./Components/Dashboard/Dashboard.js";
// import Feedback from "./Components/Feedback/Feedback";
function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <BackgroundProvider>
        <AuthenticatedTemplate>
          <Router>
            <Routes>
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </Router>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <Login />
        </UnauthenticatedTemplate>
      </BackgroundProvider>
    </MsalProvider>
  );
}

export default App;
