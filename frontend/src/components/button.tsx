interface ButtonProps {
  children: React.ReactNode;
  ariaLabel: string;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  ariaLabel,
  onClick,
  className,
}) => {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className={`bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
