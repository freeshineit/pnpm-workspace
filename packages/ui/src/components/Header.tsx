export interface HeaderProps {
  text?: string;
}

export const Header = (props: HeaderProps) => {
  return <h1>{props.text}</h1>;
};
