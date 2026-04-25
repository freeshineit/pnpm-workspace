import type * as React from "react";

type CustomElementProps<T extends HTMLElement> = React.DetailedHTMLProps<React.HTMLAttributes<T>, T>;

interface WcButtonElement extends HTMLElement {}

interface WcPopoverElement extends HTMLElement {
  list?: string;
  open?: string | boolean;
}

interface WcPickerElement extends HTMLElement {
  open?: string | boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "wc-button": CustomElementProps<WcButtonElement> & {
        disabled?: boolean;
        type?: string;
      };
      "wc-popover": CustomElementProps<WcPopoverElement> & {
        list?: string;
        open?: string | boolean;
      };
      "wc-picker": CustomElementProps<WcPickerElement> & {
        open?: string | boolean;
        trigger?: "click" | "hover";
        content?: string;
        placement?: "top" | "bottom" | "tl" | "tr" | "bl" | "br";
      };
    }
  }
}

export {};
