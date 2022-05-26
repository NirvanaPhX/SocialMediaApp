import "./reset.css";
import "./App.css";
import { Navbar } from "./components/layout/Navbar/Navbar";
import { Landing } from "./components/layout/Landing/Landing";

const App = () => {
  return (
    <>
      <Navbar />
      <Landing />
    </>
  );
};

export default App;
