import cl from "./Button.module.css";

interface Props {
  label: string;
  type?: "submit" | "reset";
  size: "small" | "big";
  disabled?: boolean;
  inverse?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

const Button = ({
  label,
  type,
  size,
  inverse,
  danger,
  disabled,
  onClick,
}: Props) => {
  return (
    <button
      className={`${cl.button} 
  ${size === "big" && cl.button__big} 
  ${size === "small" && cl.button__small}
  ${inverse && cl.button__inverse} 
  ${danger && cl.button__danger}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
