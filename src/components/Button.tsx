import '../scss/button.scss';

type ButtonProps = {
  className?: string;
  variant?: 'primary' | 'danger' | 'success' | 'warning' | 'dark' | 'link';
  children?: JSX.Element | string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

function Button({
  className,
  variant = 'primary',
  children,
  onClick,
  type = 'button',
  disabled = false,
}: ButtonProps): JSX.Element {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      type={type}
      className={`btn btn-${variant} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
