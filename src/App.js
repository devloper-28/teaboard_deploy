import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { userRoutes, authRoutes } from "./routes/mainRoutes/mainRoutes";
import Login from "./pages/auth/Login";
import PrivateRoutes from "./routes/privateRoute";
import HeaderUI from "./components/layout/header/Header";

const env = process.env.NODE_ENV;
console.log("🚀 ~ file: App.js:10 ~ App ~ env:", env);
if (env === "development") {
  // console.log = function () {};
  console.error = function () {};
}
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRouteWrapper />}>
          {userRoutes?.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
              exact
            />
          ))}
        </Route>

        {authRoutes?.map((route, idx) => (
          <Route key={idx} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
}

function PrivateRouteWrapper() {
  return (
    <>
      <HeaderUI />
      <PrivateRoutes />
    </>
  );
}

export default App;
