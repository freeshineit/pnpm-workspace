import React from "react";
import clsx from "clsx";

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
    <button className={classNames} style={style} disabled={disabled} type={htmlType} onClick={disabled ? undefined : onClick} aria-disabled={disabled}>
      {children}
    </button>
  );
};

Button.displayName = "Button";

export default Button;
