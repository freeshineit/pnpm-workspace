import type * as React from "react";

type CustomElementProps<T extends HTMLElement> = React.DetailedHTMLProps<React.HTMLAttributes<T>, T>;

interface WcButtonElement extends HTMLElement {}

interface WcPopoverElement extends HTMLElement {
  list?: string;
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
    }
  }
}

export {};
