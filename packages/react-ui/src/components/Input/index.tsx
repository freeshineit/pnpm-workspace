import React from "react";
import clsx from "clsx";

export interface IInputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Visual size of the input */
  size?: "small" | "middle" | "large";
  className?: string;
  style?: React.CSSProperties;
  /** Max character length */
  maxLength?: number;
  /** Input type attribute */
  type?: "text" | "password" | "email" | "number" | "tel" | "url" | "search";
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

const Input = React.forwardRef<HTMLInputElement, IInputProps>((props, ref) => {
  const { value, defaultValue, placeholder, disabled, size, className, style, maxLength, type = "text", onChange, onFocus, onBlur, onPressEnter, onKeyDown } = props;

  const classNames = clsx(
    "wc-input",
    {
      [`wc-input-${size}`]: !!size,
      "wc-input-disabled": disabled,
    },
    className,
  );

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = e => {
    if (e.key === "Enter" && onPressEnter) {
      onPressEnter(e);
    }
    onKeyDown?.(e);
  };

  const isControlled = value !== undefined;

  return (
    <input
      ref={ref}
      className={classNames}
      style={style}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      aria-disabled={disabled}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
      {...(isControlled ? { value } : { defaultValue })}
    />
  );
});

Input.displayName = "Input";

export default Input;
