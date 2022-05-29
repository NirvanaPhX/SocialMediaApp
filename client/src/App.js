import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./store";

import "./reset.css";
import "./App.css";
import { Navbar } from "./components/layout/Navbar/Navbar";
import { Landing } from "./components/layout/Landing/Landing";
import Register from "./components/auth/Register";
import { Login } from "./components/auth/Login";
import Alert from "./components/layout/Alert/Alert";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Alert />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
