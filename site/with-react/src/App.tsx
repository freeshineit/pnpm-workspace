import "@ak2021/web-components/dist/style/css.js";
import "@ak2021/web-components";
import "./App.css";
import "@ak2021/react-ui/dist/style";
import React, { useEffect, useRef } from "react";
import logo from "./logo.svg";
import { Button } from "@ak2021/react-ui";
import Store from "@ak2021/store";

function App() {
  const storeRef = useRef<Store | null>(null);
  const popoverRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (storeRef.current) return;

    storeRef.current = new Store({ id: "app-store" });
    storeRef.current.on("test", (data: unknown) => {
      console.warn("test", data);
    });

    popoverRef.current?.setAttribute(
      "list",
      JSON.stringify([
        { label: "React 内直接使用自定义标签", value: "jsx-tag" },
        { label: "复杂数据通过 attribute 或 ref 传入", value: "attribute" },
        { label: "样式需要额外引入 dist/style/css.js", value: "style" },
      ]),
    );
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
        <Button>Button</Button>
        <wc-button type="primary">Web Component Button</wc-button>
        <wc-popover ref={popoverRef}>
          <wc-button>Web Component Popover</wc-button>
        </wc-popover>
      </header>
    </div>
  );
}

export default App;
