import CreatePassword from "./component/CreatePassword";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./page/Home";
import Login from "./page/Login";
import Safe from "./page/Safe";

const App = () => {

  const login = localStorage.getItem("login");
  const password = localStorage.getItem("password");
  const isCreatePassword = !password || !login ? true : false;
 
  let defaultRouter = "/login";

  return (
    <div className="flex justify-center items-center overflow-hidden w-full h-screen bg-gradient-to-br from-emerald-700 via-teal-700 to-zinc-800">
      <BrowserRouter basename="/fileStore">
        <Routes>
          <Route path={"/create-password"} element={<CreatePassword />} />
          <Route path={"/"} element={isCreatePassword ? <CreatePassword /> : <Home />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/safe"} element={<Safe />} />
          <Route path="/*" element={<Navigate to={defaultRouter} replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
