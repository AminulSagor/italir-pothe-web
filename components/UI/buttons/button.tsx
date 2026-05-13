import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  rounded?: "md" | "lg" | "xl" | "full";
  fullWidth?: boolean;
}

const variantClasses = {
  primary: "bg-[#006B3F] text-white hover:bg-[#00552E]",
  outline: "border border-[#C9D4CC] bg-white text-[#202420] hover:bg-[#F4F7F4]",
  ghost: "bg-transparent text-[#202420] hover:bg-[#F4F7F4]",
};

const sizeClasses = {
  sm: "h-8 px-4 text-xs",
  md: "h-10 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};

const roundedClasses = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

const Button = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  rounded = "full",
  fullWidth = false,
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
        variantClasses[variant]
      } ${sizeClasses[size]} ${roundedClasses[rounded]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
