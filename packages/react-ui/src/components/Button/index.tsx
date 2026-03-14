import React from 'react';
import clsx from 'clsx';

export interface IButtonProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  type?: 'primary';
}

/**
 */
const Button = (props: IButtonProps) => {
  const classNames = clsx(
    'wc-btn',
    {
      [`wc-btn-${props.type}`]: props.type === 'primary',
    },
    props.className,
  );

  return (
    <button className={classNames} style={props.style}>
      {props.children}
    </button>
  );
};

Button.displayName = 'Button';

export default Button;
