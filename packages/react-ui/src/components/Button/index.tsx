import React from "react";
import clsx from "clsx";
import Picker from "@skax/picker";

export interface IButtonProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Visual variant of the button */
  type?: "primary";
  /** Size of the button */
  size?: "small" | "middle" | "large";
  /** Whether the button is disabled */
  disabled?: boolean;
  /** HTML button type attribute */
  htmlType?: "button" | "submit" | "reset";
  /** Click handler */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button = (props: IButtonProps) => {
  const { type, size, disabled, htmlType = "button", onClick, className, style, children } = props;

  const pickerRef = React.useRef<Picker | null>(null);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (!pickerRef.current) {
      pickerRef.current = new Picker(btnRef.current as HTMLButtonElement, {
        trigger: "hover",
        content: "<div style='padding: 12px; background-color: #FFF'>Button is disabled </div>",
        placement: "bottom",
      });
    }
  }, []);

  const classNames = clsx(
    "wc-btn",
    {
      [`wc-btn-${type}`]: !!type,
      [`wc-btn-${size}`]: !!size,
      "wc-btn-disabled": disabled,
    },
    className,
  );

  return (
    <button ref={btnRef} className={classNames} style={style} disabled={disabled} type={htmlType} onClick={disabled ? undefined : onClick} aria-disabled={disabled}>
      {children}
    </button>
  );
};

Button.displayName = "Button";

export default Button;
