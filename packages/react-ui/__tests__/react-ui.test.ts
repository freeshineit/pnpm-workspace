import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Button, Input } from "../src/index";
import MainExport from "../src/main";
import "../src/style";

describe("react-ui", () => {
  // --- exports ---
  test("exports Button from index and default export", () => {
    expect(Button).toBe(Button);
  });

  test("exports Input from index and default export", () => {
    expect(Input).toBe(Input);
  });

  test("exports Button from main default export", () => {
    expect(MainExport.Button).toBe(Button);
  });

  test("exports Input from main default export", () => {
    expect(MainExport.Input).toBe(Input);
  });

  // --- Button ---
  test("renders Button with base class and children", () => {
    const html = renderToStaticMarkup(React.createElement(Button, null, "Click Me"));
    expect(html).toContain('class="wc-btn"');
    expect(html).toContain("Click Me");
  });

  test("renders primary Button with modifier class", () => {
    const html = renderToStaticMarkup(React.createElement(Button, { type: "primary" }, "Primary"));
    expect(html).toContain("wc-btn-primary");
  });

  test("renders custom class and inline style", () => {
    const html = renderToStaticMarkup(React.createElement(Button, { className: "custom-class", style: { color: "red" } }, "Styled"));
    expect(html).toContain("custom-class");
    expect(html).toContain('style="color:red"');
  });

  test("renders disabled Button with disabled attribute and class", () => {
    const html = renderToStaticMarkup(React.createElement(Button, { disabled: true }, "Disabled"));
    expect(html).toContain('disabled=""');
    expect(html).toContain("wc-btn-disabled");
    expect(html).toContain('aria-disabled="true"');
  });

  test("renders small size Button with size class", () => {
    const html = renderToStaticMarkup(React.createElement(Button, { size: "small" }, "Small"));
    expect(html).toContain("wc-btn-small");
  });

  test("renders large size Button with size class", () => {
    const html = renderToStaticMarkup(React.createElement(Button, { size: "large" }, "Large"));
    expect(html).toContain("wc-btn-large");
  });

  test('renders submit Button with type="submit"', () => {
    const html = renderToStaticMarkup(React.createElement(Button, { htmlType: "submit" }, "Submit"));
    expect(html).toContain('type="submit"');
  });

  test('renders Button with default htmlType="button"', () => {
    const html = renderToStaticMarkup(React.createElement(Button, null, "Default"));
    expect(html).toContain('type="button"');
  });

  // --- Input ---
  test("renders Input with base class", () => {
    const html = renderToStaticMarkup(React.createElement(Input, null));
    expect(html).toContain('class="wc-input"');
  });

  test("renders Input with placeholder", () => {
    const html = renderToStaticMarkup(React.createElement(Input, { placeholder: "Enter text" }));
    expect(html).toContain('placeholder="Enter text"');
  });

  test("renders disabled Input with disabled attribute and class", () => {
    const html = renderToStaticMarkup(React.createElement(Input, { disabled: true }));
    expect(html).toContain('disabled=""');
    expect(html).toContain("wc-input-disabled");
    expect(html).toContain('aria-disabled="true"');
  });

  test("renders small size Input with size class", () => {
    const html = renderToStaticMarkup(React.createElement(Input, { size: "small" }));
    expect(html).toContain("wc-input-small");
  });

  test("renders large size Input with size class", () => {
    const html = renderToStaticMarkup(React.createElement(Input, { size: "large" }));
    expect(html).toContain("wc-input-large");
  });

  test("renders Input with defaultValue", () => {
    const html = renderToStaticMarkup(React.createElement(Input, { defaultValue: "hello" }));
    expect(html).toContain('value="hello"');
  });

  test("renders Input with password type", () => {
    const html = renderToStaticMarkup(React.createElement(Input, { type: "password" }));
    expect(html).toContain('type="password"');
  });

  test("renders Input with maxLength", () => {
    const html = renderToStaticMarkup(React.createElement(Input, { maxLength: 20 }));
    // React renders the DOM property name (maxLength) in static markup
    expect(html).toMatch(/maxlength="20"|maxLength="20"/);
  });
});
