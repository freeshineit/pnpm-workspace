import React from 'react';
import classNames from 'classnames';

export interface IButtonProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  type?: 'primary';
}

/**
 */
const Button = (props: IButtonProps) => {
  const _classNames = classNames(
    'wc-btn',
    {
      [`wc-btn-${props.type}`]: props.type === 'primary',
    },
    props.className,
  );

  return (
    <button className={_classNames} style={props.style}>
      {props.children}
    </button>
  );
};

Button.displayName = 'Button';

export default Button;
