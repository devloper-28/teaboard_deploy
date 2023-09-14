import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import "./index.css";
import "./assets/css/style.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import rootReducer from "./store/reducer"; // Replace with your actual root reducer
import rootSaga from "./store/sagas"; // Import your saga root file
import HeaderUI from "./components/layout/header/Header";
import "react-toastify/dist/ReactToastify.css";
import { PrintProvider } from "./components/common/PrintDataInTable";
const sagaMiddleware = createSagaMiddleware();

// Create the Redux store with the root reducer and Saga middleware
let store;

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  store = createStore(
    rootReducer,
    compose(
      applyMiddleware(sagaMiddleware),
      window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  );
} else {
  store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
}

// Run the saga middleware
sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PrintProvider>
        <App />
      </PrintProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
