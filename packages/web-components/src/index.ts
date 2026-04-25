import "@webcomponents/webcomponentsjs";
import "./components/button";
import "./components/picker";
import "./components/popover";

if (!customElements) {
  throw new Error("Browser not supported customElements!");
}
