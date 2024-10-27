import React from "react";
import ReactDOM from "react-dom/client";
import Container from "./container";
import "./main.css";
import { playRules } from "./rules";
import { getIndex } from "./params";

let render = () => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <Container />
    </React.StrictMode>
  );
};

// setTimeout(() => {
//   location.replace(`/?now=${Date.now()}`);
// }, 5000);

let main = () => {
  render();
  let index = getIndex();
  window.addEventListener("keydown", (event) => {
    // check space key
    if (event.key === " ") {
      location.replace(`/?grid=2&slow=2&index=${index + 1}`);
    }
  });
};

window.onload = main;
