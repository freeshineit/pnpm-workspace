import './index.scss';
import type React from 'react';
import cls from 'classnames';

export interface IButtonProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  type?: 'primary';
}

/**
 */
const Button = (props: IButtonProps) => {
  const classNames = cls(
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

export default Button;
