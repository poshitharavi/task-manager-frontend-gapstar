import { Outlet } from "react-router-dom";
import "./App.css";
// import { useAuth } from "./context/AuthContext";
// import Navbar from "./components/ui/Navbar";

const App = () => {
  // const { isAuthenticated } = useAuth();
  return (
    <div>
      {/* {isAuthenticated && <Navbar />} */}
      <Outlet />
    </div>
  );
};

export default App;
